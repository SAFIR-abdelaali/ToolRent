from fastapi import FastAPI, Depends, HTTPException, Header, File, UploadFile, Form
from sqlalchemy.orm import Session
import jwt
import uuid
from . import models, database, s3_utils
from .database import get_db

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="Rent-My-Tool: Catalog Service", port=8001)
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