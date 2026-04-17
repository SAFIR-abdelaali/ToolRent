import boto3
import os
from botocore.exceptions import NoCredentialsError

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)
def upload_image_to_s3(file_obj, filename: str) -> str:
    """Uploads a file to AWS S3 and returns the public URL."""
    if not AWS_BUCKET_NAME or not AWS_ACCESS_KEY:
        print("⚠️ AWS Credentials missing. Returning dummy URL.")
        return f"https://dummy-cloud-storage.com/{filename}"

    try:
        s3_client.upload_fileobj(
            file_obj,
            AWS_BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": "image/jpeg"}
        )
        bucket_location = boto3.client('s3').get_bucket_location(Bucket=AWS_BUCKET_NAME)
        region = bucket_location['LocationConstraint'] or 'us-east-1'
        public_url = f"https://{AWS_BUCKET_NAME}.s3.{region}.amazonaws.com/{filename}"
        return public_url
        
    except NoCredentialsError:
        print("⚠️ AWS Credentials invalid.")
        return f"https://dummy-cloud-storage.com/{filename}"