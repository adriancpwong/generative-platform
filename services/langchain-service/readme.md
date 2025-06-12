Example usage from BE:

import httpx

async def process_with_chain(text: str):
async with httpx.AsyncClient() as client:
response = await client.post(
"http://langchain-service:8100/generate",
json={"text": text}
)
return response.json()

docker-compose up -d --build langchain-service

curl -X POST "http://localhost:8100/generate" \
 -H "Content-Type: application/json" \
 -d '{"text":"Explain quantum computing"}'
