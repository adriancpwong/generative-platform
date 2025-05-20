from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from test-service 1"}

@app.get("/generate")
async def generate_text():
    return {"text": "This is AI-generated content from Service 1!"}