
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { Send, Bot, User, Sparkles, ExternalLink } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  links?: { title: string; uri: string }[];
}

const AIChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: '你好！我是你的 2026 日本旅遊小幫手。有什麼我可以幫你的嗎？（例如：如何從新宿去箱根？、推薦澀谷的拉麵店）' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await gemini.askTravelGuide(userMsg);
    
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: response.text || "抱歉，我現在無法回答這個問題。",
      links: response.links
    }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100 safe-area-top">
        <h1 className="text-xl font-black text-slate-900 flex items-center">
          <Sparkles className="text-red-500 mr-2" size={20} />
          旅遊 AI 助手
        </h1>
        <p className="text-xs text-slate-500 mt-1">即時查詢景點、交通、美食資訊</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar"
        style={{ maxHeight: 'calc(100vh - 250px)' }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
              m.role === 'user' 
                ? 'bg-red-500 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <div className="flex items-center mb-1">
                {m.role === 'ai' ? <Bot size={12} className="mr-1 opacity-50" /> : <User size={12} className="mr-1 opacity-50" />}
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  {m.role === 'ai' ? 'GEMINI TRAVEL' : 'YOU'}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              
              {m.links && m.links.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 mb-2">相關參考資料</p>
                  <div className="space-y-2">
                    {m.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 text-xs hover:underline"
                      >
                        <ExternalLink size={10} className="mr-1" />
                        <span className="truncate">{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="輸入旅遊問題..."
            className="flex-grow bg-transparent border-none outline-none text-sm py-2"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className={`ml-2 p-2 rounded-full ${input.trim() ? 'bg-red-500 text-white shadow-md' : 'text-slate-400'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;
