import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Loader2, Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 border-b border-teal-600">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5" />
          台灣城市嚮導
        </h2>
        <p className="text-teal-100 text-xs mt-1">
          由 Gemini & Qdrant 驅動的 RAG 系統
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">請詢問關於台灣城市的資訊，<br/>例如：「台南有什麼好吃的？」</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                 {msg.role === 'user' ? <User className="w-3 h-3"/> : <Bot className="w-3 h-3"/>}
                 <span>{msg.role === 'user' ? '你' : 'AI 導遊'}</span>
              </div>
              <div className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {msg.content}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">參考來源:</p>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.map((src, idx) => (
                      <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span className="text-sm text-gray-500">正在思考並搜尋資料庫...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="輸入您的問題..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;