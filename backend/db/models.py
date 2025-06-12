from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SavedContent(Base):
    __tablename__ = "saved_content"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    source = Column(String, default="editor")