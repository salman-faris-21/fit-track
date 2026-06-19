import os
from langchain_openai import OpenAIEmbeddings

class EmbeddingService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
            
        model = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-large")
        
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=api_key,
            model=model
        )

    def get_embeddings(self) -> OpenAIEmbeddings:
        return self.embeddings
