from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    ragMethod1: str | None = None
    ragMethod2: str | None = None
    ragMethod3: str | None = None
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
    if request.ragMethod1:
        received_data.append(f"Received RAG method1: {request.ragMethod1}")
    if request.ragMethod2:
        received_data.append(f"Received RAG method2: {request.ragMethod2}")
    if request.ragMethod3:
        received_data.append(f"Received RAG method3: {request.ragMethod3}")
    if request.query:
        received_data.append(f"Received query: {request.query}")
    
    for data in received_data:
        print(data)
    
    return {"message": "Data received successfully"}