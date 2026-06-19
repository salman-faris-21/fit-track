import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from routes.rag_routes import router as rag_router
from utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="fit-Track Python RAG Service",
    description="Dedicated FastAPI RAG service using LangChain and ChromaDB.",
    version="1.0.0"
)

# Enable CORS for local testing/cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register RAG routing endpoints
app.include_router(rag_router)

@app.get("/")
def read_root():
    return {"message": "fit-Track Python RAG Service is up and running!"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting uvicorn server on port {port}...")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
