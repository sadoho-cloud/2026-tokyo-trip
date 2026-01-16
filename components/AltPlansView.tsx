
import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, CheckCircle2, Circle, AlertCircle, ShoppingBag, StickyNote, PlusCircle, LayoutGrid, Check } from 'lucide-react';

interface MemoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'check' | 'shop' | 'memo';
}

const AltPlansView: React.FC = () => {
  const [items, setItems] = useState<MemoItem[]>([]);
  const [inputs, setInputs] = useState({ check: '', shop: '', memo: '' });

  // 初始化與讀取
  useEffect(() => {
    const savedItems = localStorage.getItem('japan_2026_memos_v2');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Data corruption, resetting memos");
      }
    } else {
      const defaultChecks: MemoItem[] = [
        { id: 'd-1', text: 'Visit Japan Web (VJW) 截圖備份', completed: false, category: 'check' },
        { id: 'd-2', text: '護照正本 + 影本 (分開存放)', completed: false, category: 'check' },
        { id: 'd-3', text: 'Suica 卡加值並確認餘額', completed: false, category: 'check' },
        { id: 'd-4', text: '飯店與新幹線預約 QR Code', completed: false, category: 'check' },
        { id: 'd-5', text: '日本網卡 / WiFi 機確認', completed: false, category: 'check' },
        { id: 'd-6', text: '日幣現金 (小額為主) + JCB 信用卡', completed: false, category: 'check' },
      ];
      setItems(defaultChecks);
    }
  }, []);

  // 自動存檔
  useEffect(() => {
    localStorage.setItem('japan_2026_memos_v2', JSON.stringify(items));
  }, [items]);

  const addItem = (category: 'check' | 'shop' | 'memo') => {
    const text = inputs[category].trim();
    if (!text) return;

    const newItem: MemoItem = {
      id: `${category}-${Date.now()}`,
      text,
      completed: false,
      category
    };
    setItems(prev => [newItem, ...prev]);
    setInputs(prev => ({ ...prev, [category]: '' }));
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const renderSection = (title: string, category: 'check' | 'shop' | 'memo', icon: React.ReactNode, themeColor: string) => {
    const sectionItems = items.filter(item => item.category === category);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-2xl shadow-sm ${themeColor} bg-white border border-slate-50`}>
              {icon}
            </div>
            <h2 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em]">{title}</h2>
          </div>
          <div className="px-2.5 py-1 bg-slate-100 rounded-full">
            <span className="text-[10px] font-black text-slate-400">
              {sectionItems.filter(i => i.completed).length} / {sectionItems.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-slate-100">
          {/* Input Area */}
          <div className="flex items-center p-4 bg-slate-50/40 border-b border-slate-50">
            <input 
              type="text" 
              value={inputs[category]}
              onChange={(e) => setInputs({ ...inputs, [category]: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addItem(category)}
              placeholder={`輸入${title}內容...`}
              className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-300 px-2"
            />
            <button 
              onClick={() => addItem(category)} 
              className={`p-2 rounded-xl transition-all ${inputs[category].trim() ? 'bg-red-500 text-white shadow-md' : 'text-slate-300'}`}
            >
              <PlusCircle size={20} />
            </button>
          </div>

          {/* List Area */}
          <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto no-scrollbar">
            {sectionItems.length > 0 ? (
              sectionItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center p-4 group active:bg-slate-50 cursor-pointer transition-all animate-in fade-in slide-in-from-right-2"
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    item.completed ? 'bg-emerald-500 border-emerald-500 scale-90' : 'border-slate-100 bg-white'
                  }`}>
                    {item.completed && <Check size={14} className="text-white" />}
                  </div>
                  
                  <span className={`ml-4 flex-grow text-sm transition-all ${
                    item.completed ? 'text-slate-300 line-through' : 'text-slate-700 font-bold'
                  }`}>
                    {item.text}
                  </span>
                  
                  <button 
                    onClick={(e) => deleteItem(item.id, e)}
                    className="p-2 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all active:scale-125"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-10 text-center flex flex-col items-center">
                <LayoutGrid className="text-slate-100 mb-2" size={32} />
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">No Items Yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-10 pb-24 max-w-md mx-auto">
      <header className="flex flex-col">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Checklist</h1>
        <div className="h-1 w-12 bg-red-500 mt-2"></div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] mt-3">2026 Japan Trip Memos</p>
      </header>

      <div className="space-y-12">
        {/* 1. 出發前檢查 */}
        {renderSection(
          "Pre-Departure", 
          "check", 
          <AlertCircle className="text-amber-500" size={18} />, 
          "text-amber-500"
        )}

        {/* 2. 購物清單 */}
        {renderSection(
          "Shopping List", 
          "shop", 
          <ShoppingBag className="text-red-500" size={18} />, 
          "text-red-500"
        )}

        {/* 3. 隨手筆記 */}
        {renderSection(
          "Quick Notes", 
          "memo", 
          <StickyNote className="text-blue-500" size={18} />, 
          "text-blue-500"
        )}
      </div>

      <footer className="pt-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/10 rounded-full"></div>
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-xs font-black tracking-widest uppercase">Sync Status: Active</p>
              <p className="text-slate-500 text-[10px] font-medium mt-1">您的資料已自動安全儲存於本機裝置</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AltPlansView;
