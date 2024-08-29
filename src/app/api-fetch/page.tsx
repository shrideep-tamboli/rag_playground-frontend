"use client"
import { useEffect, useState } from 'react';
import '../globals.css';

export default function ApiFetch() {
  const [data, setData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/') // Adjust the port based on your backend
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('http://127.0.0.1:8000/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        setFileInfo(result);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-black p-4 text-white">
        <h1 className="text-xl font-bold mb-4">RAG Playground.io</h1>
        <ul>
          <li className="mb-2">
            <label htmlFor="fileInput" className="cursor-pointer">
              Upload Document
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </li>
          <li className="mb-2">Fine-Tuning</li>
        </ul>
      </aside>

      <main className="flex-1 p-4 bg-white text-black">
        
        <h1 className="text-2xl font-bold mb-4">Data from Backend displaying in frontend:</h1>
        {data ? <p>{data.message}</p> : <p>Loading...</p>}

        {fileInfo && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">Uploaded File Info:</h2>
            <p>Filename: {fileInfo.filename}</p>
            <p>Length: {fileInfo.length} bytes</p>
          </div>
        )}

      </main>
    </div>
  );
}
