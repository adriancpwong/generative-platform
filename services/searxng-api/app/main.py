from fastapi import FastAPI, HTTPException
import requests
from pydantic import BaseModel

app = FastAPI()

class SearchRequest(BaseModel):
    query: str
    engines: list[str] = ["google", "bing"]  # Default engines
    lang: str = "en"  # Default language

@app.post("/search")
async def search(search_req: SearchRequest):
    try:
        # Forward the query to SearXNG
        searx_url = "http://searxng:8080/search"
        params = {
            "q": search_req.query,
            "engines": ",".join(search_req.engines),
            "language": search_req.lang,
            "format": "json",
        }
        response = requests.get(searx_url, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))