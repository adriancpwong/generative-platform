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


# @app.on_event("startup")
# async def startup():
#     await init_db(engine)

@app.post("/api/chat")
async def chat_with_llm(request: ChatRequest):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://local-llm-service:8001/chat",
                json={"message": request.message, "max_new_tokens": 500},
                timeout=3000.0
            )
            return response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"LLM service error: {str(e)}")

@app.get("/api/health")
async def health_check():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://local-llm-service:8001/health")
            return response.json()
        except httpx.RequestError:
            return {"status": "unhealthy"}