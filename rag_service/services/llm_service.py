import os
import math
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from services.embedding_service import EmbeddingService
from utils.logger import get_logger

logger = get_logger(__name__)

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    dot_product = sum(a * b for a, b in zip(v1, v2))
    magnitude_v1 = math.sqrt(sum(a * a for a in v1))
    magnitude_v2 = math.sqrt(sum(b * b for b in v2))
    if magnitude_v1 == 0 or magnitude_v2 == 0:
        return 0.0
    return dot_product / (magnitude_v1 * magnitude_v2)

class LLMService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
            
        self.completion_model = os.getenv("OPENAI_COMPLETION_MODEL", "gpt-3.5-turbo")
        self.llm = ChatOpenAI(
            openai_api_key=api_key,
            model=self.completion_model,
            temperature=0.7
        )
        self.embedding_service = EmbeddingService()

    def generate_answer_from_document_context(self, query: str, context_chunks: List[Dict[str, Any]]) -> str:
        """
        Generates an answer using retrieved PDF/TXT document chunks as context.
        """
        logger.info(f"Generating answer for document query using {len(context_chunks)} retrieved chunks")
        
        # Build context string
        context_str = ""
        for idx, chunk in enumerate(context_chunks):
            filename = chunk["metadata"].get("filename", "document")
            chunk_idx = chunk["metadata"].get("chunkIndex", 0)
            context_str += f"[{idx+1}] Source: {filename} (Chunk {chunk_idx})\nContent:\n{chunk['text']}\n\n"
            
        system_prompt = (
            "You are a helpful, professional fitness coach and health expert assistant.\n"
            "Use the following pieces of retrieved context from fitness reports and documents "
            "to answer the user's question. If you do not know the answer or if the context "
            "does not contain the information, state that you do not have enough information "
            "based on the uploaded documents. Do not make up facts."
        )
        
        user_prompt = (
            f"Retrieved Document Context:\n"
            f"{context_str}\n"
            f"User Question: {query}\n"
            f"Answer:"
        )
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        response = self.llm.invoke(messages)
        return response.content

    def generate_fitness_program_from_logs(self, logs: List[Dict[str, Any]], prompt: str) -> Dict[str, Any]:
        """
        Replicates the original Node.js RAG logic for user activity logs:
        - Embeds logs and query, computes cosine similarity
        - Sorts and retrieves the top 6 logs
        - Constructs prompt and calls ChatOpenAI
        """
        logger.info(f"Generating fitness program from logs (Logs count: {len(logs)})")
        
        if not logs:
            logger.info("No activity logs available for user. Running fallback completion.")
            # Fallback when no logs exist
            fallback_prompt = f"No logs are available for this user. {prompt}"
            system_content = "You are a trustworthy fitness coach. Provide a general, safe weekly fitness plan with diet, hydration, and sleep advice."
            
            messages = [
                {"role": "system", "content": system_content},
                {"role": "user", "content": fallback_prompt}
            ]
            response = self.llm.invoke(messages)
            
            return {
                "result": response.content,
                "retrievalContext": "No logs available for this user.",
                "retrievedChunks": [],
                "model": self.completion_model
            }

        # 1. Prepare texts for embedding
        chunk_texts = [
            f"{entry['date']} | {entry['source']} | {entry['text']}" for entry in logs
        ]
        
        # 2. Generate embeddings
        embeddings_engine = self.embedding_service.get_embeddings()
        chunk_embeddings = embeddings_engine.embed_documents(chunk_texts)
        query_text = f"Retrieve the most relevant fitness activity logs for this query: {prompt}"
        query_embedding = embeddings_engine.embed_query(query_text)
        
        # 3. Compute cosine similarity & rank
        ranked_logs = []
        for idx, entry in enumerate(logs):
            score = cosine_similarity(query_embedding, chunk_embeddings[idx])
            ranked_logs.append({
                "date": entry["date"],
                "source": entry["source"],
                "text": entry["text"],
                "score": score
            })
            
        ranked_logs.sort(key=lambda x: x["score"], reverse=True)
        retrieved_chunks = ranked_logs[:6] # Top 6 chunks
        
        # 4. Construct prompt and context
        context_text = "\n".join([
            f"{idx + 1}. Date: {chunk['date']} | {chunk['source']} | {chunk['text']}"
            for idx, chunk in enumerate(retrieved_chunks)
        ])
        
        full_retrieval_context = "\n".join([
            f"{entry['date']} | {entry['source']}: {entry['text']}" for entry in logs
        ])
        
        system_content = "You are a practical and safe fitness coach. Use only the retrieved log snippets when answering the user. Do not hallucinate user data."
        
        user_content = (
            "You are an expert fitness coach providing retrieval-augmented answers.\n"
            "Use only the retrieved user activity logs below to answer the request. "
            "If the logs are incomplete, make reasonable, safe fitness recommendations but do not invent specific user data.\n\n"
            f"Retrieved logs:\n{context_text}\n\n"
            f"User request:\n{prompt}\n\n"
            "Answer with:\n"
            "- Summary of the user's current fitness profile\n"
            "- A 7-day workout plan\n"
            "- Diet guidance\n"
            "- Hydration and sleep targets\n"
            "- Motivational coaching notes\n"
        )
        
        messages = [
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_content}
        ]
        
        response = self.llm.invoke(messages)
        
        return {
            "result": response.content,
            "retrievalContext": full_retrieval_context,
            # Map the retrieved chunks to the structure expected by the frontend
            "retrievedChunks": [
                {
                    "date": chunk["date"],
                    "source": chunk["source"],
                    "text": chunk["text"],
                    "score": chunk["score"]
                }
                for chunk in retrieved_chunks
            ],
            "model": self.completion_model
        }
