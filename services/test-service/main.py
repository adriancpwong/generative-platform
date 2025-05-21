from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = FastAPI()

# Use a smaller model optimized for CPU/Apple Silicon
# MODEL_NAME = "HuggingFaceH4/zephyr-7b-beta"  # ~3GB download
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # ~500MB download

# Configure for Apple Metal (MPS) if available
device = "mps" if torch.backends.mps.is_available() else "cpu"
torch_dtype = torch.float32  # Use float32 on Apple Silicon

@app.on_event("startup")
async def load_model():
    global tokenizer, model
    print(f"Loading model on device: {device}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        device_map=device,
        torch_dtype=torch_dtype
    )

class ChatRequest(BaseModel):
    message: str
    max_new_tokens: int = 100

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