import React, { useState } from 'react';
import { TerminalWindow } from './TerminalWindow';

interface CodeViewerProps {
  title: string;
  filename: string;
  code: string;
  language: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ title, filename, code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TerminalWindow title={title} className="h-full">
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-2 text-xs border-b border-terminal-gray">
          <span className="text-gray-400">{filename}</span>
          <button 
            onClick={handleCopy}
            className="text-terminal-green hover:text-white transition-colors"
          >
            {copied ? "[ COPIED ]" : "[ COPY ]"}
          </button>
        </div>
        <pre className="flex-1 p-4 overflow-auto text-sm text-gray-300 scrollbar-thin scrollbar-thumb-terminal-gray scrollbar-track-transparent">
          <code>{code}</code>
        </pre>
      </div>
    </TerminalWindow>
  );
};