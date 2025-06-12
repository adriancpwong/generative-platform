from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

router = APIRouter()

class N8NWebhook(BaseModel):
    event: str  # e.g., "editor_saved"
    payload: dict

@router.post("/n8n/webhook")
async def handle_n8n_webhook(
    webhook: N8NWebhook,
    x_n8n_signature: str = Header(None)  # Optional auth
):
    # Verify signature if needed
    if x_n8n_signature != "your_secret_key":
        raise HTTPException(status_code=403, detail="Invalid signature")

    # Route events
    if webhook.event == "editor_saved":
        await process_editor_content(webhook.payload)
    elif webhook.event == "search_request":
        await trigger_search(webhook.payload)

    return {"status": "processed"}