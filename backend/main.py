from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend"}

@app.get("/api/ai-response")
async def get_ai_response():
    async with httpx.AsyncClient() as client:
        # Call the AI service (running on 8001)
        response = await client.get("http://test-service:8001/generate")
        sample_response = {
            "text": "This is AI-generated content from Service 1!"
        }
        return sample_response
        #return response.json()