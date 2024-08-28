"use client"
import { useEffect, useState } from 'react';
import '../globals.css';

export default function ApiFetch() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/') // Adjust the port based on your backend
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-black p-4 text-white">
        <h1 className="text-xl font-bold mb-4">RAG Playground.io</h1>
        <ul>
          <li className="mb-2 font-['Roboto Mono']">Menu Item 1</li>
          <li className="mb-2 font-['DM Sans']">Menu Item 2</li>
          <li className="mb-2 font-['DM Sans']">Menu Item 3</li>
        </ul>
      </aside>
      <main className="flex-1 p-4 bg-white text-black font-['Roboto Mono']">
        <h1 className="text-2xl font-bold mb-4">Data from Backend:</h1>
        {data ? <p>{data.message}</p> : <p>Loading...</p>}
      </main>
    </div>
  );
}
