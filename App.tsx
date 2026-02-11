import React, { useState } from 'react';
import { TerminalWindow } from './components/TerminalWindow';
import { CodeViewer } from './components/CodeViewer';
import { analyzeInfrastructureError } from './services/geminiService';
import { 
  PYTHON_SCRIPT_CONTENT, 
  DOCKERFILE_CONTENT, 
  ENV_EXAMPLE_CONTENT,
  USAGE_EXAMPLE,
  SAMPLE_ERRORS 
} from './constants';

enum View {
  INTERACTIVE = 'INTERACTIVE',
  CLI_TOOL = 'CLI_TOOL'
}

enum FileView {
  PYTHON = 'PYTHON',
  DOCKER = 'DOCKER',
  ENV = 'ENV',
  USAGE = 'USAGE'
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.INTERACTIVE);
  const [activeFile, setActiveFile] = useState<FileView>(FileView.PYTHON);
  const [inputLog, setInputLog] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputLog.trim()) return;
    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await analyzeInfrastructureError(inputLog);
      setOutput(result);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (log: string) => {
    setInputLog(log);
    setError(null);
    setOutput(null);
  };

  return (
    <div className="min-h-screen bg-black text-terminal-text font-mono p-4 md:p-8 flex flex-col gap-6 selection:bg-terminal-green selection:text-black">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-terminal-gray pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            <span className="text-terminal-green">&gt;</span> InfraCopilot
          </h1>
          <p className="text-sm text-gray-500 mt-1">GenAI-powered SRE Troubleshooting Assistant</p>
        </div>
        <div className="flex bg-terminal-gray rounded p-1">
          <button
            onClick={() => setActiveView(View.INTERACTIVE)}
            className={`px-4 py-2 text-sm rounded transition-all ${activeView === View.INTERACTIVE ? 'bg-terminal-green text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Web Console
          </button>
          <button
            onClick={() => setActiveView(View.CLI_TOOL)}
            className={`px-4 py-2 text-sm rounded transition-all ${activeView === View.CLI_TOOL ? 'bg-terminal-green text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Download CLI
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full">
        
        {activeView === View.INTERACTIVE && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
            
            {/* Input Column */}
            <div className="flex flex-col gap-4">
              <TerminalWindow title="user@infra-copilot:~/logs" className="flex-1 min-h-[400px]">
                <div className="flex flex-col h-full p-4">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                    <span className="text-terminal-green">$</span>
                    <span>cat error.log</span>
                  </div>
                  <textarea
                    className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-300 placeholder-gray-700"
                    placeholder="// Paste your error log here..."
                    value={inputLog}
                    onChange={(e) => setInputLog(e.target.value)}
                  />
                  
                  {/* Sample Chips */}
                  <div className="mt-4 pt-4 border-t border-terminal-gray">
                    <p className="text-xs text-gray-500 mb-2">Load sample log:</p>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_ERRORS.map((sample, idx) => (
                        <button
                          key={idx}
                          onClick={() => loadSample(sample.log)}
                          className="px-2 py-1 text-xs border border-terminal-gray rounded hover:border-terminal-green hover:text-terminal-green transition-colors text-left truncate max-w-[120px]"
                          title={sample.log}
                        >
                          {sample.type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading || !inputLog.trim()}
                      className={`px-6 py-2 bg-terminal-green text-black font-bold rounded hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin">◴</span> Analyzing...
                        </>
                      ) : (
                        <>
                          <span>▶</span> Analyze Log
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </TerminalWindow>
            </div>

            {/* Output Column */}
            <div className="flex flex-col h-full">
              <TerminalWindow title="infra-copilot:~/analysis" className="flex-1 min-h-[400px]">
                <div className="p-6 h-full overflow-auto">
                  {!output && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                      <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>Waiting for input...</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                       <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-terminal-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-terminal-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-terminal-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <p className="text-terminal-green text-sm blink">Processing error log...</p>
                    </div>
                  )}

                  {error && (
                    <div className="text-terminal-red border border-terminal-red/20 bg-terminal-red/10 p-4 rounded">
                      <p className="font-bold">SYSTEM ERROR:</p>
                      <p className="mt-1">{error}</p>
                    </div>
                  )}

                  {output && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="border-b border-terminal-gray pb-2 mb-4">
                        <span className="text-terminal-green font-bold">REPORT GENERATED</span>
                       </div>
                       <div className="whitespace-pre-wrap leading-relaxed text-sm">
                         {output.split('\n').map((line, i) => {
                           if (line.startsWith('ROOT CAUSE:')) {
                             return (
                               <div key={i} className="mb-4">
                                 <span className="text-terminal-red font-bold">ROOT CAUSE:</span>
                                 <p className="mt-1 pl-4 border-l-2 border-terminal-red/50 text-white">{line.replace('ROOT CAUSE:', '').trim()}</p>
                               </div>
                             );
                           }
                           if (line.startsWith('FIX:')) {
                             return (
                               <div key={i} className="mb-4">
                                 <span className="text-terminal-blue font-bold">FIX:</span>
                                 <div className="mt-1 pl-4 border-l-2 border-terminal-blue/50">
                                   <code className="bg-terminal-gray px-2 py-1 rounded text-terminal-green block w-fit">{line.replace('FIX:', '').trim()}</code>
                                 </div>
                               </div>
                             );
                           }
                           if (line.startsWith('PREVENTION:')) {
                             return (
                               <div key={i} className="mb-4">
                                 <span className="text-yellow-500 font-bold">PREVENTION:</span>
                                 <p className="mt-1 pl-4 border-l-2 border-yellow-500/50 text-gray-300">{line.replace('PREVENTION:', '').trim()}</p>
                               </div>
                             );
                           }
                           if (!line.trim()) return null;
                           return <p key={i} className="text-gray-400">{line}</p>;
                         })}
                       </div>
                    </div>
                  )}
                </div>
              </TerminalWindow>
            </div>
          </div>
        )}

        {activeView === View.CLI_TOOL && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
             {/* Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <div className="bg-terminal-gray/30 p-4 rounded-lg border border-terminal-gray mb-4">
                <h3 className="font-bold text-white mb-2">Install Locally</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Run the Python version of InfraCopilot directly in your production terminal.
                </p>
                <div className="space-y-1">
                  {[
                    { id: FileView.PYTHON, label: 'infra_copilot.py', icon: '🐍' },
                    { id: FileView.DOCKER, label: 'Dockerfile', icon: '🐳' },
                    { id: FileView.ENV, label: '.env.example', icon: '🔒' },
                    { id: FileView.USAGE, label: 'Usage Guide', icon: '📖' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveFile(item.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-all flex items-center gap-3 ${activeFile === item.id ? 'bg-terminal-gray text-terminal-green border border-terminal-green/30' : 'text-gray-400 hover:text-white hover:bg-terminal-gray/50'}`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Viewer */}
            <div className="lg:col-span-9 h-full">
              {activeFile === FileView.PYTHON && (
                <CodeViewer 
                  title="vim infra_copilot.py" 
                  filename="infra_copilot.py" 
                  code={PYTHON_SCRIPT_CONTENT} 
                  language="python" 
                />
              )}
              {activeFile === FileView.DOCKER && (
                <CodeViewer 
                  title="vim Dockerfile" 
                  filename="Dockerfile" 
                  code={DOCKERFILE_CONTENT} 
                  language="dockerfile" 
                />
              )}
              {activeFile === FileView.ENV && (
                <CodeViewer 
                  title="vim .env" 
                  filename=".env.example" 
                  code={ENV_EXAMPLE_CONTENT} 
                  language="bash" 
                />
              )}
               {activeFile === FileView.USAGE && (
                <CodeViewer 
                  title="bash" 
                  filename="README.md" 
                  code={USAGE_EXAMPLE} 
                  language="bash" 
                />
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;