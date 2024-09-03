"use client"
import { useEffect, useState } from 'react';
import '../globals.css';
import { FaCog } from 'react-icons/fa';

interface RAGDropdownProps {
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  response: string | null;
  filename: string | null;
  onFineTuningChange: (llm: string, framework: string) => void;
}

function RAGDropdown({ value, onChange, response, filename, onFineTuningChange }: RAGDropdownProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');

  const handleFineTuningClose = () => {
    setIsDialogOpen(false);
    if (selectedLLM && selectedFramework) {
      onFineTuningChange(selectedLLM, selectedFramework);
    }
  };

  return (
    <div className="w-full p-6 border-2 border-gray-300 rounded-lg relative">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        <FaCog size={20} />
      </button>
      
      <div className="mt-4">
        <select 
          value={value || ''}
          onChange={onChange}
          className="p-2 border border-gray-300 rounded-md w-full mb-2"
        >
          <option value="" disabled>Choose a RAG method</option>
          <option value="Traditional RAG">Traditional RAG</option>
          <option value="Multi-modal RAG">Multi-modal RAG</option>
          <option value="Agentic RAG">Agentic RAG</option>
          <option value="Graph RAG">Graph RAG</option>
        </select>
      </div>
      
      {(response || filename) && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md w-full overflow-x-auto" style={{ maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
          <pre className="whitespace-pre-wrap break-words text-sm">
            {filename && `Uploaded file: ${filename}\n`}
            {response}
          </pre>
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Fine Tuning</h2>
            <select
              value={selectedLLM}
              onChange={(e) => setSelectedLLM(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            >
              <option value="" disabled>Select LLM</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-v1">Claude v1</option>
            </select>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            >
              <option value="" disabled>Select Framework</option>
              <option value="langchain">LangChain</option>
              <option value="llama-index">LlamaIndex</option>
              <option value="haystack">Haystack</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleFineTuningClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
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
  const [fineTuningSettings, setFineTuningSettings] = useState<{ [key: number]: { llm: string, framework: string } }>({});

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

  const handleFineTuningChange = (index: number, llm: string, framework: string) => {
    setFineTuningSettings(prev => ({
      ...prev,
      [index]: { llm, framework }
    }));
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
        if (selectedOption) {
          payload.ragMethod1 = selectedOption;
          if (fineTuningSettings[0]) {
            payload.fineTuning1 = fineTuningSettings[0];
          }
        }
        if (selectedOption2) {
          payload.ragMethod2 = selectedOption2;
          if (fineTuningSettings[1]) {
            payload.fineTuning2 = fineTuningSettings[1];
          }
        }
        if (selectedOption3) {
          payload.ragMethod3 = selectedOption3;
          if (fineTuningSettings[2]) {
            payload.fineTuning3 = fineTuningSettings[2];
          }
        }

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
          `RAG Method: ${method.method}\nReceived query: ${result.query}\nQuery length: ${result.query_length} \nRagFunctionOutput: ${result.rag_results[method.index - 1].result} `
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

  const handleAddRAGMethod = () => {
    if (!showTwoDropdowns) {
      setShowTwoDropdowns(true);
    } else if (!showThreeDropdowns) {
      setShowThreeDropdowns(true);
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
                  onFineTuningChange={(llm, framework) => handleFineTuningChange(0, llm, framework)}
                />
              </div>
              {selectedOption && !queryResponses[0] && (
                <button
                  onClick={handleAddRAGMethod}
                  className="mb-4 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 w-2/5"
                >
                  Choose another RAG method
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full mb-4 space-x-4">
                <div className="w-1/3">
                  <RAGDropdown
                    value={selectedOption}
                    onChange={handleSelectChange}
                    response={queryResponses[0]}
                    filename={fileInfo?.filename || null}
                    onFineTuningChange={(llm, framework) => handleFineTuningChange(0, llm, framework)}
                  />
                </div>

                <div className="w-1/3">
                  <RAGDropdown
                    value={selectedOption2}
                    onChange={handleSelectChange2}
                    response={queryResponses[1]}
                    filename={fileInfo?.filename || null}
                    onFineTuningChange={(llm, framework) => handleFineTuningChange(1, llm, framework)}
                  />
                  {selectedOption2 && !showThreeDropdowns && !queryResponses[1] && (
                    <div className="mt-2">
                      <button
                        onClick={handleAddRAGMethod}
                        className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 w-full"
                      >
                        Choose another RAG method
                      </button>
                    </div>
                  )}
                </div>

                {showThreeDropdowns && (
                  <div className="w-1/3">
                    <RAGDropdown
                      value={selectedOption3}
                      onChange={handleSelectChange3}
                      response={queryResponses[2]}
                      filename={fileInfo?.filename || null}
                      onFineTuningChange={(llm, framework) => handleFineTuningChange(2, llm, framework)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {(selectedOption || selectedOption2 || selectedOption3 || showTwoDropdowns) && (
          <div className="absolute bottom-0 left-0 right-0 pb-10 flex justify-center items-center">
            <input
              type="text"
              placeholder="Enter your query here"
              className="p-2 border border-gray-300 rounded-md w-[70%]"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleInputSubmit}
            />
            {(queryResponses[0] || queryResponses[1] || queryResponses[2]) && !showThreeDropdowns && (
              <button
                onClick={handleAddRAGMethod}
                className="ml-2 w-10 h-10 bg-gray-700 text-white rounded-full hover:bg-gray-800 flex items-center justify-center"
              >
                <span className="text-2xl">+</span>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
