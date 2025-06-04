from pydantic import BaseModel
from typing import Optional, Dict, Any

class MCPMessage(BaseModel):
    sender: str
    receiver: str
    message_type: str  # "request", "response", "acknowledge", etc.
    status: Optional[str] = "pending"
    protocol: str = "MCP-v1"
    body: Dict[str, Any]  # Flexible payload
    metadata: Optional[Dict[str, Any]] = None  # For routing/instructions