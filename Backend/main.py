from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FineTuning(BaseModel):
    llm: Optional[str] = None
    framework: Optional[str] = None
    textSplitter: Optional[str] = None
    embeddingModel: Optional[str] = None
    chunkSize: Optional[str] = None
    vectorStore: Optional[str] = None

class ProcessRequest(BaseModel):
    ragMethod1: Optional[str] = None
    ragMethod2: Optional[str] = None
    ragMethod3: Optional[str] = None
    fineTuning1: Optional[FineTuning] = None
    fineTuning2: Optional[FineTuning] = None
    fineTuning3: Optional[FineTuning] = None
    query: str

@app.get('/')
def get_data():
    return {"message": "Hello from FastAPI!"}

@app.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    file_length = len(contents)
    print(f"File size:", file_length)
    return {"filename": file.filename, "length": file_length}

@app.post('/process')
async def process_query(request: ProcessRequest):
    received_data = []
    rag_methods = []
    rag_results = []

    for i, method in enumerate([request.ragMethod1, request.ragMethod2, request.ragMethod3], start=1):
        if method:
            fine_tuning = getattr(request, f'fineTuning{i}')
            received_data.append(f"Received RAG method{i}: {method}")
            if fine_tuning:
                fine_tuning_details = fine_tuning.dict(exclude_none=True)
                fine_tuning_str = ", ".join(f"{k}={v}" for k, v in fine_tuning_details.items())
                received_data.append(f"Fine-tuning for method{i}: {fine_tuning_str}")
            rag_methods.append({
                "index": i, 
                "method": method, 
                "fine_tuning": fine_tuning.dict(exclude_none=True) if fine_tuning else None
            })
            
            # Call the appropriate RAG method function
            if method == "Traditional RAG":
                result = vector_retrieval(method, request.query, fine_tuning)
            elif method == "Multi-modal RAG":
                result = multi_modal_rag(method, request.query, fine_tuning)
            elif method == "Agentic RAG":
                result = agentic_rag(method, request.query, fine_tuning)
            elif method == "Graph RAG":
                result = graph_rag(method, request.query, fine_tuning)
            else:
                result = None

            if result:
                rag_results.append({"method": method, "result": result})

    if request.query:
        received_data.append(f"Received query: {request.query}")
    
    for data in received_data:
        print(data)
    
    response = {
        "message": "Data received successfully",
        "query": request.query,
        "query_length": len(request.query),
        "rag_methods": rag_methods,
        "rag_results": rag_results
    }

    return response

############################################################################

from dotenv import load_dotenv
import os

## api keys
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY2')

## Setting up LLMOps
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")

## Setting up retrieval using langchain famework
from langchain_openai import ChatOpenAI

# RAG Method Functions
def vector_retrieval(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        fine_tuning_str = ", ".join(f"{k}={v}" for k, v in fine_tuning.dict(exclude_none=True).items())
        temp_var += f" (Fine-tuning: {fine_tuning_str})"
    return "Vector Retrieval: " + temp_var

def multi_modal_rag(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        fine_tuning_str = ", ".join(f"{k}={v}" for k, v in fine_tuning.dict(exclude_none=True).items())
        temp_var += f" (Fine-tuning: {fine_tuning_str})"
    return "Multi-modal RAG: " + temp_var

def agentic_rag(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        fine_tuning_str = ", ".join(f"{k}={v}" for k, v in fine_tuning.dict(exclude_none=True).items())
        temp_var += f" (Fine-tuning: {fine_tuning_str})"
    return "Agentic RAG: " + temp_var

def graph_rag(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        fine_tuning_str = ", ".join(f"{k}={v}" for k, v in fine_tuning.dict(exclude_none=True).items())
        temp_var += f" (Fine-tuning: {fine_tuning_str})"
    return "Graph RAG: " + temp_var
