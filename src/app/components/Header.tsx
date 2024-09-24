'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
  { name: "Playground", path: "/playground" },
  { name: "Evaluation", path: "/evaluation" },
  { name: "RAG Agent", path: "/rag-agent" }
];

export default function Header() {
  const currentPath = usePathname();

  return (
    <header className="flex h-20 bg-black text-white">
      <div className="w-1/5 flex items-center justify-center">
        <h1 className="text-4xl font-bold">RAGIt</h1>
      </div>
      <div className="w-4/5 flex items-center justify-end pr-8">
        <div className="flex">
          {pages.map((page) => (
            <Link 
              key={page.name} 
              href={page.path}
              className={`
                px-4 py-12 rounded-lg transition-colors duration-300
                ${currentPath === page.path 
                  ? "bg-white text-black" 
                  : "bg-black text-white hover:bg-white hover:text-black"
                }
                h-[20px] flex items-center justify-center
              `}
            >
              {page.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}