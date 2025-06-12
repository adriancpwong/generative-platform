from fastapi import FastAPI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from .models import ChainInput
import httpx

app = FastAPI()

# Initialize with your local LLM service
LOCAL_LLM_ENDPOINT = "http://local-llm-service:8001/generate"

async def query_local_llm(prompt: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            LOCAL_LLM_ENDPOINT,
            json={"prompt": prompt}
        )
        return response.json().get("text", "")

@app.post("/generate")
async def generate_text(input: ChainInput):
    # Example chain - customize as needed
    prompt = PromptTemplate(
        input_variables=["input"],
        template="You are a helpful AI. Respond to: {input}"
    )
    
    llm_chain = LLMChain(
        llm=OpenAI(openai_api_base=LOCAL_LLM_ENDPOINT),
        prompt=prompt
    )
    
    result = await llm_chain.arun(input.text)
    return {"result": result}