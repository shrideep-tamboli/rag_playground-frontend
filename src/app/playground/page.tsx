"use client"
import { useEffect, useState } from 'react';
import '../globals.css';
import { FaCog, FaUpload } from 'react-icons/fa';
import Link from 'next/link';
import Header from '../components/Header';

interface RAGDropdownProps {
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  response: string | null;
  filename: string | null;
  onFineTuningChange: (settings: Partial<FineTuningSettings>) => void;
}

type FineTuningSettings = {
  llm: string;
  framework: string;
  textSplitter: string;
  embeddingModel: string;
  chunkSize: string;
  vectorStore: string;
};

function RAGDropdown({ value, onChange, response, filename, onFineTuningChange }: RAGDropdownProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedTextSplitter, setSelectedTextSplitter] = useState('');
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState('');
  const [selectedChunkSize, setSelectedChunkSize] = useState('');
  const [selectedVectorStore, setSelectedVectorStore] = useState('');

  const handleFineTuningClose = () => {
    setIsDialogOpen(false);
    const fineTuningSettings = {
      llm: selectedLLM,
      framework: selectedFramework,
      textSplitter: selectedTextSplitter,
      embeddingModel: selectedEmbeddingModel,
      chunkSize: selectedChunkSize,
      vectorStore: selectedVectorStore
    };
    // Filter out empty values
    const filteredSettings = Object.fromEntries(
      Object.entries(fineTuningSettings).filter(([_, v]) => v !== '')
    );
    onFineTuningChange(filteredSettings);
  };

  return (
    <div className="w-full p-6 border-2 border-gray-300 rounded-lg relative">
      <div className="absolute top-2 right-2 group">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <FaCog size={20} />
        </button>
        <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          Fine Tuning
        </span>
      </div>
      
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
        <div className="mt-2 p-2 bg-gray-100 rounded-md w-full overflow-x-auto" style={{ maxHeight: 'calc(55vh)', overflowY: 'auto' }}>
          <pre className="whitespace-pre-wrap break-words text-sm">
            {filename && `Uploaded file: ${filename}\n`}
            {response}
          </pre>
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Fine Tuning</h2>
            <select
              value={selectedLLM}
              onChange={(e) => setSelectedLLM(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            >
              <option value="" disabled>Select LLM</option>
              <option value="llama-3.1-70b-versatile">Llama 3.1 <i>(default)</i></option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo <i>(api key required)</i></option>
              <option value="gpt-4">GPT-4 <i>(api key required)</i></option>
              <option value="claude-v1">Claude v1 <i>(api key required)</i></option>
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
            <select
              value={selectedTextSplitter}
              onChange={(e) => setSelectedTextSplitter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            >
              <option value="" disabled>Select Text Splitter</option>
              <option value="character">Character Text Splitter</option>
              <option value="token">Token Text Splitter</option>
              <option value="recursive_character">Recursive Character Text Splitter</option>
            </select>
            <select
              value={selectedEmbeddingModel}
              onChange={(e) => setSelectedEmbeddingModel(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            >
              <option value="" disabled>Select Embedding Model</option>
              <option value="openai">OpenAI Embeddings (api key required)</option>
              <option value="huggingface">HuggingFace Embeddings (default)</option>
              <option value="cohere">Cohere Embeddings (api key required)</option>
            </select>
            <select
              value={selectedChunkSize}
              onChange={(e) => setSelectedChunkSize(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            >
              <option value="" disabled>Select Chunk Size</option>
              <option value="256">256 tokens</option>
              <option value="512">512 tokens</option>
              <option value="1024">1024 tokens</option>
            </select>
            <select
              value={selectedVectorStore}
              onChange={(e) => setSelectedVectorStore(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            >
              <option value="" disabled>Select Vector Store</option>
              <option value="pinecone">Pinecone</option>
              <option value="faiss">FAISS</option>
              <option value="chroma">Chroma</option>
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
  const [fineTuningSettings, setFineTuningSettings] = useState<{ [key: number]: Partial<FineTuningSettings> }>({});

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

  const handleFineTuningChange = (index: number, settings: Partial<FineTuningSettings>) => {
    setFineTuningSettings(prev => ({
      ...prev,
      [index]: settings
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
            
            [selectedOption, selectedOption2, selectedOption3].forEach((option, index) => {
                if (option) {
                    payload[`ragMethod${index + 1}`] = option;
                    const settings = fineTuningSettings[index];
                    if (settings && Object.keys(settings).length > 0) {
                        payload[`fineTuning${index + 1}`] = settings;
                    }
                }
            });

            console.log('Sending payload:', payload); // Log the payload for debugging

            const response = await fetch('http://127.0.0.1:8000/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Server response:', result);
            
            const newResponses = result.rag_methods.map((method: { index: number, method: string }) => {
                const ragResult = result.rag_results.find((r: any) => r.method === method.method);
                return `
Question: ${result.query}
Answer: ${ragResult ? ragResult.result : 'No result'}
${method.fine_tuning ? `Fine-tuning: ${JSON.stringify(method.fine_tuning, null, 2)}` : ''}`;
                        //Uploaded File Content: ${result.file_content}`;  // Include the first 100 characters of the file content
                        });
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

  const pages = [
    { name: "Playground", path: "/Playground" },
    { name: "Evaluation", path: "/evaluation" },
    { name: "RAG Agent", path: "/rag-agent" }
  ];

  const currentPath = "/Playground"; // This should be dynamically set based on the current route

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-1 p-4 bg-white text-black relative overflow-x-auto">
        <div className="flex flex-col items-center pt-0">
          {!showTwoDropdowns ? (
            <>
              <div className="w-2/5 mb-4">
                <RAGDropdown
                  value={selectedOption}
                  onChange={handleSelectChange}
                  response={queryResponses[0]}
                  filename={fileInfo?.filename || null}
                  onFineTuningChange={(settings) => handleFineTuningChange(0, settings)}
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
              <div className={`flex mb-4 px-4 ${showThreeDropdowns ? 'justify-between' : 'justify-center space-x-5'}`}>
                <div className={showThreeDropdowns ? 'w-[calc(33%-16px)]' : 'w-[calc(50%-10px)] max-w-[540px]'}>
                  <RAGDropdown
                    value={selectedOption}
                    onChange={handleSelectChange}
                    response={queryResponses[0]}
                    filename={fileInfo?.filename || null}
                    onFineTuningChange={(settings) => handleFineTuningChange(0, settings)}
                  />
                </div>

                <div className={showThreeDropdowns ? 'w-[calc(33%-16px)]' : 'w-[calc(50%-10px)] max-w-[540px]'}>
                  <RAGDropdown
                    value={selectedOption2}
                    onChange={handleSelectChange2}
                    response={queryResponses[1]}
                    filename={fileInfo?.filename || null}
                    onFineTuningChange={(settings) => handleFineTuningChange(1, settings)}
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
                  <div className="w-[calc(33%-16px)]">
                    <RAGDropdown
                      value={selectedOption3}
                      onChange={handleSelectChange3}
                      response={queryResponses[2]}
                      filename={fileInfo?.filename || null}
                      onFineTuningChange={(settings) => handleFineTuningChange(2, settings)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {(selectedOption || selectedOption2 || selectedOption3 || showTwoDropdowns) && (
          <div className="absolute bottom-0 left-0 right-0 pb-10 flex justify-center items-center">
            <div className="relative w-[70%]">
              <input
                type="text"
                placeholder="Enter your query here"
                className="p-2 pr-10 border border-gray-300 rounded-md w-full"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleInputSubmit}
              />
              <label 
                htmlFor="fileInput" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer group"
              >
                <FaUpload className="text-gray-500 group-hover:text-gray-700" />
                <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  File Upload
                </span>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileUpload}
                  onClick={() => console.log('File input clicked')}
                />
              </label>
            </div>
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
