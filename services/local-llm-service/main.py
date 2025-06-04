import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = FastAPI()

# Configuration
MODEL_DIR = os.getenv("MODEL_DIR", "/app/models")  # Default Docker path
MODEL_NAME = os.getenv("MODEL_NAME", "tinyllama")  # Default model

# Configure for Apple Metal (MPS) if available
device = "mps" if torch.backends.mps.is_available() else "cpu"
torch_dtype = torch.float32  # Use float32 on Apple Silicon

def get_model_path(base_path: str) -> str:
    """Resolve the actual model path in HuggingFace cache structure"""
    # base_path = Path(base_path)
    snapshots_dir = Path(base_path + "/snapshots/")

    print(f"Checking for snapshots in: {snapshots_dir}")
    
    if snapshots_dir.exists():
        print(f"Snapshots directory exists: {snapshots_dir}")
        for snapshot in snapshots_dir.iterdir():
            print(f"Found snapshot: {snapshot}")
            if snapshot.is_dir():
                print(f"Using snapshot: {snapshot}")
                return str(snapshot)
    return str(base_path)

@app.on_event("startup")
async def load_model():
    global tokenizer, model
    base_path = f"{MODEL_DIR}/{MODEL_NAME}"
    model_path = get_model_path(base_path)
    
    print(f"Loading model from: {model_path}")
    tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map="auto",
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        local_files_only=True
    )

class ChatRequest(BaseModel):
    message: str
    max_new_tokens: int = 500

@app.post("/chat")
async def chat_with_llm(request: ChatRequest):
    try:
        prompt = f"<|user|>\n{request.message}</s>\n<|assistant|>"
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        
        outputs = model.generate(
            **inputs,
            max_new_tokens=request.max_new_tokens,
            temperature=0.7,
            do_sample=True
        )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return {"response": response.split("<|assistant|>")[1].strip()}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
