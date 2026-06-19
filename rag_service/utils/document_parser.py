import os
from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import PyMuPDFLoader, TextLoader
from utils.logger import get_logger

logger = get_logger(__name__)

def parse_document(file_path: str) -> List[Document]:
    """
    Parses a PDF or TXT document using the appropriate LangChain loader.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found at: {file_path}")
        
    ext = os.path.splitext(file_path)[1].lower()
    logger.info(f"Parsing document '{file_path}' with file extension '{ext}'")
    
    if ext == ".pdf":
        loader = PyMuPDFLoader(file_path)
    elif ext == ".txt":
        loader = TextLoader(file_path, encoding="utf-8")
    else:
        raise ValueError(f"Unsupported file format '{ext}'. Only PDF and TXT documents are supported.")
        
    documents = loader.load()
    logger.info(f"Successfully loaded {len(documents)} document pages/segments")
    return documents
