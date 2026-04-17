from pydantic import BaseModel
from typing import Optional


class ToolUpdate(BaseModel):
	title: Optional[str] = None
	description: Optional[str] = None
	price: Optional[float] = None
