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

# Global variable to store the uploaded file content
uploaded_file_content = None

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
    global uploaded_file_content  # Use the global variable
    uploaded_file_content = await file.read()  # Store the entire file content
    file_length = len(uploaded_file_content)
    print(f"Uploaded file size: {file_length} bytes")
    return {"filename": file.filename, "length": file_length}  # Return the uploaded file info

@app.post('/process')
async def process_query(request: ProcessRequest):
    received_data = []
    rag_methods = []
    rag_results = []

    print("Received request:", request)

    # Access the global uploaded file content
    file_content_str = ""
    if uploaded_file_content is not None:
        file_content_str = uploaded_file_content.decode('utf-8')  # Decode the binary content
        received_data.append(f"Uploaded file size: {len(uploaded_file_content)} bytes")
        received_data.append(f"File content: {file_content_str[:100]}...")  # Show first 100 chars

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
        "rag_results": rag_results,
        "uploaded_file_size": len(uploaded_file_content) if uploaded_file_content else None,  # Include uploaded file size
        "file_content": file_content_str[:100]  # Include the first 100 characters of the file content
    }

    return response
#######################################################################################################

import os
## Environment varibale initialization
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE")
groq_api_key = os.getenv("groq_api_key")
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY2')
LANGCHAIN_TRACING_V2 = "true"
LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY")

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

#######################################################################################################

