
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { MattAIService } from '../services/geminiService';
import { Bot, Sparkles, Send, X, Loader2, Play, BrainCircuit, MessageSquare } from 'lucide-react';

interface MattAIPanelProps {
  project: Project;
  onClose: () => void;
  isOpen: boolean;
}

const MattAIPanel: React.FC<MattAIPanelProps> = ({ project, onClose, isOpen }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: `Hello. I am Matt AI, initialized for project **${project.name}**. \n\nI have analyzed the current phase (${project.phase}). How may I assist in optimizing your workflow?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const context = `
      Project: ${project.name}
      Current Phase: ${project.phase}
      Status: ${project.status}
      Current Step: ${project.currentStep}
      Description: ${project.description}
    `;

    const response = await MattAIService.chat(newMessages, context);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const runAction = async (action: 'readiness' | 'nextsteps') => {
    setIsLoading(true);
    let result = '';
    let userText = '';

    if (action === 'readiness') {
      userText = "Run a Phase Readiness Check.";
      setMessages(prev => [...prev, { role: 'user', text: userText }]);
      result = await MattAIService.checkReadiness(project);
    } else {
      userText = "Suggest Next Steps.";
      setMessages(prev => [...prev, { role: 'user', text: userText }]);
      result = await MattAIService.suggestNextSteps(project);
    }

    setMessages(prev => [...prev, { role: 'model', text: result }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[450px] bg-white shadow-2xl border-l border-slate-200 flex flex-col z-50 transform transition-transform duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="bg-slate-900 p-5 flex justify-between items-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[50px] opacity-30"></div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30 backdrop-blur-md">
            <BrainCircuit className="text-indigo-400" size={24} />
          </div>
          <div>
             <h2 className="font-bold text-lg tracking-wide">Matt AI</h2>
             <div className="flex items-center space-x-1.5">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Online • v2.5</p>
             </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition bg-white/5 p-2 rounded-lg hover:bg-white/10 z-10">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-md">
                <Bot size={16} className="text-indigo-400" />
              </div>
            )}
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <Bot size={16} className="text-indigo-400" />
              </div>
             <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Processing...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
        <button 
           onClick={() => runAction('readiness')}
           disabled={isLoading}
           className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 border border-transparent transition-all disabled:opacity-50"
        >
          <Sparkles size={14} />
          <span>Check Readiness</span>
        </button>
        <button 
           onClick={() => runAction('nextsteps')}
           disabled={isLoading}
           className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 border border-transparent transition-all disabled:opacity-50"
        >
          <Play size={14} />
          <span>Suggest Next Steps</span>
        </button>
      </div>

      {/* Input */}
      <div className="p-5 bg-white border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-5 pr-14 py-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
            placeholder="Ask Matt for guidance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MattAIPanel;
