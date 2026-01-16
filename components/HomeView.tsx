
import React, { useState, useEffect } from 'react';
import { TRIP_START_DATE, ITINERARY } from '../constants';
import { Calendar, MapPin, Wind, Zap, MessageSquare, ChevronRight, Navigation } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [daysLeft, setDaysLeft] = useState(0);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const start = new Date(TRIP_START_DATE);
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      
      const diffTime = startDate.getTime() - today.getTime();
      setDaysLeft(Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));

      const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff < 0) setCurrentDayIndex(0);
      else if (dayDiff >= ITINERARY.length) setCurrentDayIndex(ITINERARY.length - 1);
      else setCurrentDayIndex(dayDiff);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 3600000);
    return () => clearInterval(interval);
  }, []);

  const currentPlan = ITINERARY[currentDayIndex];
  const isTripStarted = daysLeft === 0;

  return (
    <div className="p-5 space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">2026 日本旅程</h1>
        <p className="text-slate-500 text-sm font-medium">01.24 - 01.31 東京・輕井澤</p>
      </header>

      {/* 倒數區塊 - 乾淨白底 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 card-flat relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            {isTripStarted ? '旅程狀態' : '倒數出發'}
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold text-red-500">{isTripStarted ? `Day ${currentDayIndex + 1}` : daysLeft}</span>
            <span className="text-slate-400 font-bold text-lg">{isTripStarted ? '/ 8' : 'DAYS'}</span>
          </div>
        </div>
        <Zap className="absolute right-[-20px] bottom-[-20px] text-red-500 opacity-[0.03]" size={160} />
      </div>

      {/* 功能入口 - 高對比圖示 */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'itinerary', label: '每日行程', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { id: 'weather', label: '天氣建議', icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50' },
          { id: 'map', label: '地點導航', icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { id: 'ai', label: '旅行 AI', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' }
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="bg-white p-4 rounded-xl border border-slate-200 card-flat flex flex-col items-start active:bg-slate-50 transition-colors"
          >
            <div className={`${item.bg} p-2 rounded-lg mb-3`}>
              <item.icon className={item.color} size={22} />
            </div>
            <span className="font-bold text-slate-800 text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 今日預覽 */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
            {isTripStarted ? '今日亮點' : '行程搶先看'}
          </h2>
          <button onClick={() => onNavigate('itinerary')} className="text-red-500 text-xs font-bold flex items-center">
            完整列表 <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 card-flat">
          <div className="flex items-center mb-4 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 mr-4 flex-shrink-0">
              <img src={`https://picsum.photos/seed/${currentPlan.title}/200/200`} alt="Theme" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase">{currentPlan.date} ({currentPlan.dayOfWeek})</p>
              <h3 className="font-bold text-slate-800 text-sm leading-tight">{currentPlan.title}</h3>
            </div>
          </div>

          <div className="space-y-3">
            {currentPlan.events.slice(0, 2).map((event) => (
              <div key={event.id} className="flex items-start">
                <div className="text-[10px] font-bold text-slate-400 w-10 pt-1">{event.time}</div>
                <div className="flex-grow ml-2">
                  <p className="font-bold text-slate-800 text-xs leading-tight">{event.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
