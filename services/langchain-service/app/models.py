from pydantic import BaseModel

class ChainInput(BaseModel):
    text: str
    chain_type: str = "default"