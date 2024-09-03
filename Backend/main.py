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
    llm: str
    framework: str

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
                received_data.append(f"Fine-tuning for method{i}: LLM={fine_tuning.llm}, Framework={fine_tuning.framework}")
            rag_methods.append({"index": i, "method": method, "fine_tuning": fine_tuning})
            
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

def vector_retrieval(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        temp_var += f" (LLM: {fine_tuning.llm}, Framework: {fine_tuning.framework})"
    return "Vector Retrieval: " + temp_var

def multi_modal_rag(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        temp_var += f" (LLM: {fine_tuning.llm}, Framework: {fine_tuning.framework})"
    return "Multi-modal RAG: " + temp_var

def agentic_rag(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        temp_var += f" (LLM: {fine_tuning.llm}, Framework: {fine_tuning.framework})"
    return "Agentic RAG: " + temp_var

def graph_rag(rag_method: str, query: str, fine_tuning: Optional[FineTuning] = None):
    temp_var = rag_method + " " + query
    if fine_tuning:
        temp_var += f" (LLM: {fine_tuning.llm}, Framework: {fine_tuning.framework})"
    return "Graph RAG: " + temp_var
