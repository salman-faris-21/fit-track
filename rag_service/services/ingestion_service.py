import os
import datetime
from typing import Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter
from utils.document_parser import parse_document
from services.vector_service import VectorService
from utils.logger import get_logger

logger = get_logger(__name__)

class IngestionService:
    def __init__(self):
        self.vector_service = VectorService()
        self.chunk_size = int(os.getenv("RAG_CHUNK_SIZE", "1000"))
        self.chunk_overlap = int(os.getenv("RAG_CHUNK_OVERLAP", "200"))
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap
        )

    def ingest_file(self, file_path: str, document_id: str, original_filename: str) -> Dict[str, Any]:
        """
        Parses, splits, enriches with metadata, and stores the file in ChromaDB.
        """
        logger.info(f"Ingesting file '{original_filename}' (ID: {document_id}) from: {file_path}")
        
        # 1. Parse document to get standard langchain documents
        pages = parse_document(file_path)
        
        # 2. Split text
        chunks = self.splitter.split_documents(pages)
        logger.info(f"Split file into {len(chunks)} chunks (chunk_size={self.chunk_size}, overlap={self.chunk_overlap})")
        
        # 3. Add metadata to each chunk
        upload_date = datetime.datetime.utcnow().isoformat()
        
        for idx, chunk in enumerate(chunks):
            # Preserve page number metadata if present from PyMuPDF
            page_num = chunk.metadata.get("page", 0)
            chunk.metadata = {
                "documentId": document_id,
                "filename": original_filename,
                "uploadDate": upload_date,
                "chunkIndex": idx,
                "page": page_num
            }
            
        # 4. Ingest into ChromaDB
        self.vector_service.add_documents(chunks)
        
        return {
            "success": True,
            "documentId": document_id,
            "filename": original_filename,
            "chunksCount": len(chunks)
        }
