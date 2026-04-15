# Authentication Service 

This microservice acts as the central Identity Provider for the Rent-My-Tool platform. It handles secure user registration, credential verification, and stateless authentication using JSON Web Tokens (JWT).

## Tech Stack
* **Framework:** FastAPI (Python 3.11)
* **Database:** PostgreSQL 15
* **Security:** Bcrypt (Password Hashing), PyJWT (Stateless Auth)
* **Infrastructure:** Fully Dockerized (App + DB + pgAdmin)

## Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose installed on your machine.
* A `.env` file in the root directory containing your `SECRET_KEY` and database credentials (see `.env.example`).

## How to Run 

The easiest and recommended way to run the service is through our containerized environment. This will automatically boot the PostgreSQL database, the FastAPI application, and the pgAdmin dashboard.

```bash
docker-compose up --build -d

python -m uvicorn app.main:app --reload --port 8000 
```
## Testing

Run the swagger and check: http://localhost:8000/docs
You can either run it on the browser or test it in Postman



