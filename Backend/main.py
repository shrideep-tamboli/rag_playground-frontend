from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

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

    for i in range(1, 4):
        method = getattr(request, f'ragMethod{i}')
        fine_tuning = getattr(request, f'fineTuning{i}')
        if method:
            received_data.append(f"Received RAG method{i}: {method}")
            if fine_tuning:
                received_data.append(f"Fine-tuning for method{i}: {fine_tuning.dict(exclude_none=True)}")
            rag_methods.append({"index": i, "method": method, "fine_tuning": fine_tuning.dict(exclude_none=True) if fine_tuning else None})
            
            result = process_rag_method(method, request.query, fine_tuning)
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

def process_rag_method(method: str, query: str, fine_tuning: Optional[FineTuning] = None) -> str:
    result = f"{method} processing: {query}"
    if fine_tuning:
        fine_tuning_str = ", ".join(f"{k}={v}" for k, v in fine_tuning.dict(exclude_none=True).items())
        result += f" (Fine-tuning: {fine_tuning_str})"
    return result
