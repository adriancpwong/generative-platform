from sqlalchemy import select
from .models import SavedContent

async def save_content(db, content: str, source: str = "editor"):
    db_content = SavedContent(content=content, source=source)
    db.add(db_content)
    await db.commit()
    await db.refresh(db_content)
    return db_content

async def get_content(db, content_id: int):
    result = await db.execute(select(SavedContent).where(SavedContent.id == content_id))
    return result.scalars().first()