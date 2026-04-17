import boto3
import os
import shutil
from botocore.exceptions import ClientError, NoCredentialsError

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
LOCAL_UPLOAD_DIR = os.getenv("LOCAL_UPLOAD_DIR", "uploads")
LOCAL_BASE_URL = os.getenv("LOCAL_UPLOAD_BASE_URL", "http://localhost:8001/uploads")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)

def _save_local(file_obj, filename: str) -> str:
    base_url = LOCAL_BASE_URL.rstrip("/")
    file_obj.seek(0)
    file_path = os.path.join(LOCAL_UPLOAD_DIR, filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as out_file:
        shutil.copyfileobj(file_obj, out_file)
    return f"{base_url}/{filename}"
def upload_image_to_s3(file_obj, filename: str) -> str:
    """Uploads a file to AWS S3 and returns the public URL."""
    if not AWS_BUCKET_NAME or not AWS_ACCESS_KEY or not AWS_SECRET_KEY:
        print("AWS credentials missing. Saving locally.")
        return _save_local(file_obj, filename)

    try:
        s3_client.upload_fileobj(
            file_obj,
            AWS_BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": "image/jpeg"}
        )
        bucket_location = s3_client.get_bucket_location(Bucket=AWS_BUCKET_NAME)
        region = bucket_location.get('LocationConstraint') or 'us-east-1'
        public_url = f"https://{AWS_BUCKET_NAME}.s3.{region}.amazonaws.com/{filename}"
        return public_url
        
    except (NoCredentialsError, ClientError):
        print("AWS upload failed. Saving locally.")
        return _save_local(file_obj, filename)