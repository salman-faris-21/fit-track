import os
from typing import List, Dict, Any
from services.vector_service import VectorService
from utils.logger import get_logger

logger = get_logger(__name__)

class RetrievalService:
    def __init__(self):
        self.vector_service = VectorService()
        self.top_k = int(os.getenv("TOP_K_RESULTS", "5"))

    def retrieve_context(self, query: str) -> List[Dict[str, Any]]:
        """
        Retrieves the top-k relevant document chunks for the query.
        Returns a list of dicts with text and metadata.
        """
        logger.info(f"Retrieving context for query: '{query}' with top_k={self.top_k}")
        docs = self.vector_service.similarity_search(query, k=self.top_k)
        
        results = []
        for doc in docs:
            results.append({
                "text": doc.page_content,
                "metadata": doc.metadata
            })
        return results
