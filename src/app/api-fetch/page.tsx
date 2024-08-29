"use client"
import { useEffect, useState } from 'react';
import '../globals.css';

export default function ApiFetch() {
  const [data, setData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/') // Adjust the port based on your backend
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleInputSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!selectedOption) {
        alert('Please select a RAG method first');
        return;
      }
      try {
        const response = await fetch('http://127.0.0.1:8000/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ragMethod: selectedOption,
            query: inputText,
          }),
        });
        const result = await response.json();
        console.log('Server response:', result);
        // Handle the response as needed (e.g., update state, display results)
      } catch (error) {
        console.error('Error sending data to server:', error);
      }
      setInputText(''); // Clear the input after submission
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData(); //create FormData object to store file data
      formData.append('file', file); //append file to formData
      
      try {
        const response = await fetch('http://127.0.0.1:8000/upload', { //send POST request to backend endpoint
          method: 'POST',
          body: formData,
        });
        console.log('Received response from backend');
        const result = await response.json(); //parse response from backend as JSON
        setFileInfo(result); //update fileInfo state with result
        console.log('Uploaded File Info:');
        console.log('Parsed response:', result);
        console.log(`Filename: ${result.filename}`);
        console.log(`Length: ${result.length} bytes`);
      } catch (error) {
        console.error('Error uploading file:', error);
      } 
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-black p-4 pt-12 text-white">
        <h1 className="text-xl font-bold mb-4">RAG Playground.io</h1>
        <ul>
          <li className="mb-2 pt-5">
            <label htmlFor="fileInput" className="cursor-pointer">
              Upload Document
              <input //user select file using input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileUpload} //call handleFileUpload when file is selected
                onClick={() => console.log('File input clicked')}
              />
            </label>
          </li>
          <li className="mb-2 pt-5">Fine-Tuning</li>
        </ul>
      </aside>

      <main className="flex-1 p-4 bg-white text-black relative">
        <div className="flex flex-col items-center pt-10">
          <select 
            value={selectedOption || ''}
            onChange={handleSelectChange}
            className="p-2 border border-gray-300 rounded-md w-2/5 mb-4"
          >
            <option value="" disabled>Choose a RAG method</option>
            <option value="Traditional RAG">Traditional RAG</option>
            <option value="Multi-modal RAG">Multi-modal RAG</option>
            <option value="Agentic RAG">Agentic RAG</option>
            <option value="Graph RAG">Graph RAG</option>
          </select>
          {selectedOption && (
            <button
              onClick={() => setSelectedOption(null)}
              className="mb-4 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            >
              Choose another RAG method
            </button>
          )}
        </div>
        {selectedOption && (
          <div className="absolute bottom-0 left-0 right-0 pb-10 flex justify-center">
            <input
              type="text"
              placeholder="Enter your query here"
              className="p-2 border border-gray-300 rounded-md w-[70%]"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleInputSubmit}
            />
          </div>
        )}
      </main>
    </div>
  );
}
