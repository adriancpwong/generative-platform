from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_with_llm(request: ChatRequest):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://test-service:8001/chat",
                json={"message": request.message, "max_new_tokens": 100},
                timeout=30.0
            )
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"LLM service error: {str(e)}")

@app.get("/api/health")
async def health_check():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://test-service:8001/health")
            return response.json()
        except httpx.RequestError:
            return {"status": "unhealthy"}