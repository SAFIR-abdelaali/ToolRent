from fastapi import FastAPI, Depends, HTTPException, Header, File, UploadFile, Form, status
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import jwt
import uuid
from . import models, database, s3_utils, schemas
from .database import get_db

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="Rent-My-Tool: Catalog Service", port=8001)
UPLOAD_DIR = os.getenv("LOCAL_UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET_KEY = "ENSEM_2026_SUPER_SECRET_KEY"
ALGORITHM = "HS256"
def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub") 
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/tools")
def get_all_tools(db: Session = Depends(get_db)):
    return db.query(models.Tool).all()

@app.get("/tools/me")
def get_my_tools(db: Session = Depends(get_db), user_email: str = Depends(verify_token)):
    return db.query(models.Tool).filter(models.Tool.owner_email == user_email).all()

@app.post("/tools", status_code=201)
async def create_tool(
    title: str = Form(...), 
    description: str = Form(...), 
    price: float = Form(...), 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    user_email: str = Depends(verify_token)
):

    file_extension = file.filename.split(".")[-1]
    unique_filename = f"tools/{uuid.uuid4()}.{file_extension}"
    public_image_url = s3_utils.upload_image_to_s3(file.file, unique_filename)
    new_tool = models.Tool(
        title=title, 
        description=description, 
        price_per_day=price, 
        image_url=public_image_url, 
        owner_email=user_email
    )
    db.add(new_tool)
    db.commit()
    db.refresh(new_tool)
    
    return new_tool

@app.put("/tools/{tool_id}")
def update_tool(
    tool_id: int,
    payload: schemas.ToolUpdate,
    db: Session = Depends(get_db),
    user_email: str = Depends(verify_token),
):
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    if tool.owner_email != user_email:
        raise HTTPException(status_code=403, detail="Not allowed to modify this tool")

    if payload.title is None and payload.description is None and payload.price is None:
        raise HTTPException(status_code=400, detail="No updates provided")

    if payload.title is not None:
        tool.title = payload.title
    if payload.description is not None:
        tool.description = payload.description
    if payload.price is not None:
        tool.price_per_day = payload.price

    db.commit()
    db.refresh(tool)
    return tool

@app.delete("/tools/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tool(
    tool_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(verify_token),
):
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    if tool.owner_email != user_email:
        raise HTTPException(status_code=403, detail="Not allowed to delete this tool")

    db.delete(tool)
    db.commit()
    return None