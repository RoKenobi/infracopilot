import React from 'react';

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`flex flex-col rounded-lg overflow-hidden border border-terminal-gray bg-terminal-bg shadow-2xl ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-terminal-gray border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-terminal-red"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
        </div>
        <div className="text-xs text-gray-400 font-mono">{title}</div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
      <div className="p-0 h-full relative">
        {children}
      </div>
    </div>
  );
};