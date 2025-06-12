from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import ContentCreate
from ..crud import save_content
from ..db import get_db

router = APIRouter()

@router.post("/content")
async def create_content(
    content: ContentCreate,
    db: AsyncSession = Depends(get_db)
):
    return await save_content(db, content.text)