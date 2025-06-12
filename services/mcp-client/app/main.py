from fastapi import FastAPI, HTTPException
from typing import List, Dict, Optional, Any
import httpx
import logging
from datetime import datetime
from pydantic import BaseModel

class MCPMessage(BaseModel):
    sender: str
    receiver: str
    message_type: str  # "request", "response", "acknowledge", "search", etc.
    status: Optional[str] = "pending"
    protocol: str = "MCP-v1"
    body: Dict[str, Any]  # Flexible payload
    metadata: Optional[Dict[str, Any]] = None  # For routing/instructions

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp-client")

app = FastAPI(title="MCP Router")

# Expanded service registry (now includes searxng-api)
SERVICE_REGISTRY = {
    "frontend": {"host": "frontend", "port": 3000},
    "backend": {"host": "backend", "port": 8000},
    "local-llm-service": {"host": "local-llm-service", "port": 8001},
    "searxng-api": {"host": "searxng-api", "port": 5000}  # New service
}

# In-memory message store (replace with Redis in production)
message_log = []

async def forward_message(message: MCPMessage):
    """Forward validated MCP messages to their destination service."""
    try:
        receiver_service = SERVICE_REGISTRY.get(message.receiver)
        if not receiver_service:
            raise HTTPException(status_code=400, detail=f"Unknown receiver: {message.receiver}")

        url = f"http://{receiver_service['host']}:{receiver_service['port']}/receive-mcp"
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json=message.dict(),
                timeout=10.0
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
            validated_msg = MCPMessage(**msg.dict())
            
            if not validated_msg.metadata:
                validated_msg.metadata = {
                    "hops": [validated_msg.sender],
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            result = await forward_message(validated_msg)
            message_log.append(validated_msg.dict())
            results.append({
                "status": "success", 
                "message_id": len(message_log), 
                "receiver_response": result
            })
            
        except Exception as e:
            results.append({
                "status": "error", 
                "error": str(e), 
                "message": msg.dict()
            })
    
    return {"results": results}

@app.post("/mcp/execute-search")
async def execute_search(query: Dict[str, Any]):
    """Direct search endpoint for SearXNG API (bypasses MCP messaging)"""
    try:
        searxng_service = SERVICE_REGISTRY["searxng-api"]
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"http://{searxng_service['host']}:{searxng_service['port']}/search",
                json=query,
                timeout=15.0  # Longer timeout for searches
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/mcp/log")
async def get_log():
    return message_log