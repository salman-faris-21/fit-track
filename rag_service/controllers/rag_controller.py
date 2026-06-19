import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException
from services.ingestion_service import IngestionService
from services.retrieval_service import RetrievalService
from services.llm_service import LLMService
from services.vector_service import VectorService
from utils.logger import get_logger

logger = get_logger(__name__)

class RAGController:
    def __init__(self):
        self.ingestion_service = IngestionService()
        self.retrieval_service = RetrievalService()
        self.llm_service = LLMService()
        self.vector_service = VectorService()
        
        # Ensure uploads folder exists
        self.uploads_dir = os.getenv("RAG_UPLOADS_DIR", "./uploads")
        os.makedirs(self.uploads_dir, exist_ok=True)

    async def upload_file(self, file: UploadFile):
        # Generate a unique document ID
        document_id = str(uuid.uuid4())
        filename = file.filename
        
        # Temporary path inside uploads folder
        temp_file_path = os.path.join(self.uploads_dir, f"{document_id}_{filename}")
        
        try:
            logger.info(f"Saving uploaded file temporarily to: {temp_file_path}")
            with open(temp_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            # Ingest and save to ChromaDB
            result = self.ingestion_service.ingest_file(
                file_path=temp_file_path,
                document_id=document_id,
                original_filename=filename
            )
            return result
        except Exception as e:
            logger.error(f"Failed to process uploaded file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
        finally:
            if os.path.exists(temp_file_path):
                logger.info(f"Cleaning up temp file: {temp_file_path}")
                os.remove(temp_file_path)

    async def query_collection(self, query: str):
        try:
            # 1. Retrieve context
            context_chunks = self.retrieval_service.retrieve_context(query)
            
            # 2. Generate LLM response
            answer = self.llm_service.generate_answer_from_document_context(
                query=query,
                context_chunks=context_chunks
            )
            
            return {
                "success": True,
                "answer": answer,
                "sources": context_chunks
            }
        except Exception as e:
            logger.error(f"Error querying collection: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def generate_from_logs(self, logs: list, prompt: str):
        try:
            result = self.llm_service.generate_fitness_program_from_logs(logs, prompt)
            return result
        except Exception as e:
            logger.error(f"Error generating program from logs: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_document(self, document_id: str):
        try:
            success = self.vector_service.delete_document(document_id)
            if success:
                return {"success": True, "message": f"Document {document_id} and its vectors deleted successfully."}
            else:
                return {"success": False, "message": f"No documents found with documentId {document_id}."}
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def get_status(self):
        try:
            status = self.vector_service.get_status()
            return status
        except Exception as e:
            logger.error(f"Error getting vector db status: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
