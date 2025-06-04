# From postman / curl

curl -X POST "http://localhost:8003/mcp/send" \
-H "Content-Type: application/json" \
-d '[
{
"sender": "llm-service",
"receiver": "backend",
"message_type": "request",
"status": "pending",
"protocol": "MCP-v1",
"body": {"task": "generate_text", "prompt": "Hello world"}
}
]'

# From other services

import httpx

async def send_to_mcp_service(messages):
async with httpx.AsyncClient() as client:
response = await client.post(
"http://mcp-service:8003/mcp/send",
json=messages
)
return response.json()
