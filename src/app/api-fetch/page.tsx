"use client"
import { useEffect, useState } from 'react';
import '../globals.css';

interface RAGDropdownProps {
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  response: string | null;
  filename: string | null;
}

function RAGDropdown({ value, onChange, response, filename }: RAGDropdownProps) {
  return (
    <div className="w-full">
      <select 
        value={value || ''}
        onChange={onChange}
        className="p-2 border border-gray-300 rounded-md w-full"
      >
        <option value="" disabled>Choose a RAG method</option>
        <option value="Traditional RAG">Traditional RAG</option>
        <option value="Multi-modal RAG">Multi-modal RAG</option>
        <option value="Agentic RAG">Agentic RAG</option>
        <option value="Graph RAG">Graph RAG</option>
      </select>
      {(response || filename) && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md w-full overflow-x-auto" style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          <pre className="whitespace-pre-wrap break-words text-sm">
            {filename && `Uploaded file: ${filename}\n`}
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ApiFetch() {
  const [data, setData] = useState(null);
  const [fileInfo, setFileInfo] = useState<{ filename: string } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOption2, setSelectedOption2] = useState<string | null>(null);
  const [selectedOption3, setSelectedOption3] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [showTwoDropdowns, setShowTwoDropdowns] = useState(false);
  const [showThreeDropdowns, setShowThreeDropdowns] = useState(false);
  const [queryResponses, setQueryResponses] = useState<(string | null)[]>([null, null, null]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/') // Adjust the port based on your backend
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption2(event.target.value);
  };

  const handleSelectChange3 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption3(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleInputSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!selectedOption && !selectedOption2 && !selectedOption3) {
        alert('Please select at least one RAG method');
        return;
      }
      try {
        const payload: any = {
          query: inputText,
        };
        if (selectedOption) payload.ragMethod1 = selectedOption;
        if (selectedOption2) payload.ragMethod2 = selectedOption2;
        if (selectedOption3) payload.ragMethod3 = selectedOption3;

        const response = await fetch('http://127.0.0.1:8000/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        console.log('Server response:', result);
        
        const newResponses = result.rag_methods.map((method: { index: number, method: string }) => 
          `RAG Method: ${method.method}\nReceived query: ${result.query}\nQuery length: ${result.query_length}`
        );
        setQueryResponses(newResponses);
      } catch (error) {
        console.error('Error sending data to server:', error);
        setQueryResponses(['Error processing query', 'Error processing query', 'Error processing query']);
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
        setFileInfo({ filename: result.filename }); //update fileInfo state with result
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

      <main className="flex-1 p-4 bg-white text-black relative overflow-x-auto">
        <div className="flex flex-col items-center pt-10">
          {!showTwoDropdowns ? (
            <>
              <div className="w-2/5 mb-4">
                <RAGDropdown
                  value={selectedOption}
                  onChange={handleSelectChange}
                  response={queryResponses[0]}
                  filename={fileInfo?.filename || null}
                />
              </div>
              {selectedOption && (
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setShowTwoDropdowns(true);
                  }}
                  className="mb-4 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 w-2/5"
                >
                  Choose another RAG method
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full mb-4">
                <div className="w-1/3 flex justify-center">
                  <div className="w-3/4">
                    <RAGDropdown
                      value={selectedOption}
                      onChange={handleSelectChange}
                      response={queryResponses[0]}
                      filename={fileInfo?.filename || null}
                    />
                  </div>
                </div>

                <div className="w-1/3 flex justify-center">
                  <div className="w-3/4 relative">
                    <RAGDropdown
                      value={selectedOption2}
                      onChange={handleSelectChange2}
                      response={queryResponses[1]}
                      filename={fileInfo?.filename || null}
                    />
                    {selectedOption2 && !showThreeDropdowns && (
                      <div className="absolute left-0 right-0 mt-2">
                        <button
                          onClick={() => setShowThreeDropdowns(true)}
                          className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 w-full"
                        >
                          Choose another RAG method
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {showThreeDropdowns && (
                  <div className="w-1/3 flex justify-center">
                    <div className="w-3/4">
                      <RAGDropdown
                        value={selectedOption3}
                        onChange={handleSelectChange3}
                        response={queryResponses[2]}
                        filename={fileInfo?.filename || null}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {(selectedOption || selectedOption2 || selectedOption3 || showTwoDropdowns) && (
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
