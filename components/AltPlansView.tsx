
import React, { useState, useEffect } from 'react';
import { ListChecks, Plus, Trash2, CheckCircle2, Circle, AlertCircle, ShoppingBag, StickyNote, PlusCircle } from 'lucide-react';

interface MemoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'check' | 'shop' | 'memo';
}

const AltPlansView: React.FC = () => {
  const [items, setItems] = useState<MemoItem[]>([]);
  const [inputs, setInputs] = useState({ check: '', shop: '', memo: '' });

  // 1. 初始化資料 (預設事項 + 讀取 localStorage)
  useEffect(() => {
    const savedItems = localStorage.getItem('japan_2026_memos');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Failed to load memos", e);
      }
    } else {
      // 預設的出發前檢查事項
      const defaultChecks: MemoItem[] = [
        { id: 'def-1', text: 'Visit Japan Web 申報 QR Code', completed: false, category: 'check' },
        { id: 'def-2', text: '護照正本 (有效期限 6 個月以上)', completed: false, category: 'check' },
        { id: 'def-3', text: 'Suica / JR Pass 加入 Apple Wallet', completed: false, category: 'check' },
        { id: 'def-4', text: '飯店與餐廳預約憑證截圖', completed: false, category: 'check' },
        { id: 'def-5', text: '日幣現金與信用卡 (JCB/Visa)', completed: false, category: 'check' },
        { id: 'def-6', text: '行動電源與轉接頭 (日本同台灣可免)', completed: false, category: 'check' },
      ];
      setItems(defaultChecks);
    }
  }, []);

  // 2. 儲存至 localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('japan_2026_memos', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (category: 'check' | 'shop' | 'memo') => {
    if (!inputs[category].trim()) return;
    const newItem: MemoItem = {
      id: Date.now().toString(),
      text: inputs[category],
      completed: false,
      category
    };
    setItems([...items, newItem]);
    setInputs({ ...inputs, [category]: '' });
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const renderSection = (title: string, category: 'check' | 'shop' | 'memo', icon: React.ReactNode, bgColor: string) => {
    const sectionItems = items.filter(item => item.category === category);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${bgColor}`}>
              {icon}
            </div>
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-widest">{title}</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-300 bg-white border border-slate-100 px-2 py-0.5 rounded-full">
            {sectionItems.length} ITEMS
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Input Area */}
          <div className="flex items-center p-3 border-b border-slate-50 bg-slate-50/30">
            <input 
              type="text" 
              value={inputs[category]}
              onChange={(e) => setInputs({ ...inputs, [category]: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addItem(category)}
              placeholder={`新增${title}...`}
              className="flex-grow bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-300 px-2 py-1"
            />
            <button onClick={() => addItem(category)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
              <PlusCircle size={20} />
            </button>
          </div>

          {/* List Area */}
          <div className="divide-y divide-slate-50">
            {sectionItems.length > 0 ? (
              sectionItems.map((item) => (
                <div key={item.id} className="flex items-center p-4 group animate-in fade-in slide-in-from-top-1 duration-200">
                  <button 
                    onClick={() => toggleItem(item.id)}
                    className="flex-shrink-0 transition-colors"
                  >
                    {item.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-slate-200" />
                    )}
                  </button>
                  <span 
                    onClick={() => toggleItem(item.id)}
                    className={`ml-3 flex-grow text-sm transition-all cursor-pointer ${
                      item.completed ? 'text-slate-300 line-through' : 'text-slate-600 font-medium'
                    }`}
                  >
                    {item.text}
                  </span>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="ml-2 p-1 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs text-slate-300 italic font-medium">目前尚無清單事項</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <header>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">清單與備忘</h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Personal Travel Log & Checklist</p>
      </header>

      {/* 1. 出發前檢查 */}
      {renderSection(
        "出發前檢查", 
        "check", 
        <AlertCircle className="text-amber-500" size={18} />, 
        "bg-amber-50"
      )}

      {/* 2. 購物清單 */}
      {renderSection(
        "購物清單", 
        "shop", 
        <ShoppingBag className="text-red-500" size={18} />, 
        "bg-red-50"
      )}

      {/* 3. 隨手筆記 */}
      {renderSection(
        "隨手筆記", 
        "memo", 
        <StickyNote className="text-blue-500" size={18} />, 
        "bg-blue-50"
      )}

      {/* 底部小提示 */}
      <footer className="pt-4 px-2">
        <div className="bg-slate-900 rounded-2xl p-4 flex items-center shadow-lg">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3">
            <ListChecks className="text-red-500" size={16} />
          </div>
          <div>
            <p className="text-white text-[11px] font-bold">資料已同步至本地存儲</p>
            <p className="text-slate-500 text-[9px] font-medium tracking-tight">即使離線也能隨時查看您的清單</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AltPlansView;
