from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price_per_day = Column(Float)
    image_url = Column(String)    
    owner_email = Column(String)  