## ToolRent App

A decentralized, collaborative economy platform allowing neighbors to rent tools (drills, ladders, etc.), reducing overconsumption through smart resource sharing.

## Overview

Household tools are often "single-use" assets—a power drill is used for an average of only 13 minutes in its lifetime. Rent-My-Tool addresses this inefficiency with a high-availability, microservices-based cloud architecture. The system ensures secure user authentication and handles heavy media (images) via externalized Cloud Object Storage.

## Key Architectural Innovations

- **Microservices Decoupling:** Split into independent Auth and Tools services. This allows the Tools catalog to scale during peak DIY seasons (weekends) without overloading the authentication system.
- **Polyglot Persistence:** 
  - **Auth Service:** Uses PostgreSQL for ACID-compliant user data.
  - **Tools Service:** Uses PostgreSQL/MongoDB for flexible tool specifications.
- **Stateless Image Management:** Integrated with AWS S3/Google Cloud Storage. Images are never stored on the application server, ensuring the backend remains "stateless" and ready for horizontal scaling.
- **JWT-based Security:** Implemented JSON Web Tokens for secure, cross-service communication, eliminating the need for shared session state.

## Project Structure
    /ToolRent
    ├── /auth-service         # Backend: Identity provider
    ├── /tools-service       # Backend: resource manager
    ├── /frontend-web        # Frontend dashboard
    ├── docker-compose.yml    # IAC: local orchestration
    └── README.md              

## Tech Stack
- **Frontend Framework:** Next.js
- **Backend Framework:** FastAPI
- **Databases:** PostgreSQL, MongoDB
- **Cloud Infrastructure:** AWS S3, App Engine / AWS Beanstalk
- **Containerization:** Docker
- **Security:** OAuth2 + JWT

## Cloud Deployment Model
- **Model:** Public cloud
- **Type:** PaaS (Platform as a Service)
- **Justification:** We leveraged PaaS to minimize operational overhead. By using managed services (Managed DB, Object Storage), we optimized for scalability and performance while reducing the time-to-market for this MVP.



---
*Developed by Abdelaali Safir, Amine Mahraoui and Mohamed Halloub — ENSEM*