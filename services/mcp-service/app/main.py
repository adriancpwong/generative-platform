from fastapi import FastAPI, HTTPException
from typing import List, Dict, Optional
import httpx
import logging
from schemas import MCPMessage

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp-service")

app = FastAPI(title="MCP Router")

# Service registry (maps service names to their Docker network URLs and ports)
SERVICE_REGISTRY = {
    "frontend": {"host": "frontend", "port": 3000},
    "backend": {"host": "backend", "port": 8000},
    "local-llm-service": {"host": "local-llm-service", "port": 8001}
}

# In-memory message store (replace with Redis in production)
message_log = []

async def forward_message(message: MCPMessage):
    """Forward validated MCP messages to their destination service."""
    try:
        # Lookup receiver in service registry
        receiver_service = SERVICE_REGISTRY.get(message.receiver)
        if not receiver_service:
            raise HTTPException(status_code=400, detail=f"Unknown receiver: {message.receiver}")

        # Prepare HTTP call
        url = f"http://{receiver_service['host']}:{receiver_service['port']}/receive-mcp"
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json=message.dict(),
                timeout=10.0  # Fail fast
            )
            response.raise_for_status()
            
            logger.info(f"Forwarded message to {message.receiver} at {url}")
            return response.json()

    except httpx.HTTPError as e:
        logger.error(f"Failed to forward to {message.receiver}: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Receiver service error: {str(e)}")

@app.post("/mcp/send")
async def send_messages(messages: List[MCPMessage]):
    """Validate and route MCP messages."""
    results = []
    for msg in messages:
        try:
            # Validate message structure (Pydantic does this automatically)
            validated_msg = MCPMessage(**msg.dict())
            
            # Add metadata if missing
            if not validated_msg.metadata:
                validated_msg.metadata = {
                    "hops": [validated_msg.sender],
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            # Forward and log
            result = await forward_message(validated_msg)
            message_log.append(validated_msg.dict())
            results.append({"status": "success", "message_id": len(message_log), "receiver_response": result})
            
        except Exception as e:
            results.append({"status": "error", "error": str(e), "message": msg.dict()})
    
    return {"results": results}

@app.get("/mcp/log")
async def get_log():
    return message_log