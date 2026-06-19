from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from controllers.rag_controller import RAGController

router = APIRouter()
controller = RAGController()

# Pydantic Schemas for validation
class QueryRequest(BaseModel):
    query: str

class GenerateFromLogsRequest(BaseModel):
    logs: List[Dict[str, Any]]
    prompt: str

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Receives PDF/TXT file upload, chunks, embeds, and saves to vector db.
    """
    return await controller.upload_file(file)

@router.post("/query")
async def query_collection(request: QueryRequest):
    """
    Performs similarity search over document chunks and constructs context-aware LLM answer.
    """
    return await controller.query_collection(request.query)

@router.post("/generate_from_logs")
async def generate_from_logs(request: GenerateFromLogsRequest):
    """
    Analyzes historical user fitness logs, ranks them, and generates a weekly workout plan.
    """
    return await controller.generate_from_logs(request.logs, request.prompt)

@router.delete("/delete/{document_id}")
async def delete_document(document_id: str):
    """
    Deletes all chunks associated with a specific document ID.
    """
    return await controller.delete_document(document_id)

@router.get("/status")
async def get_status():
    """
    Retrieves vector DB connection information and metrics.
    """
    return await controller.get_status()
