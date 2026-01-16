
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
      // Reset hours to compare dates only
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const start = new Date(TRIP_START_DATE);
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      
      const diffTime = startDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays > 0 ? diffDays : 0);

      // Determine which day of the itinerary we are on
      const dayDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff < 0) {
        setCurrentDayIndex(0); // Before trip
      } else if (dayDiff >= ITINERARY.length) {
        setCurrentDayIndex(ITINERARY.length - 1); // After trip
      } else {
        setCurrentDayIndex(dayDiff);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 3600000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const currentPlan = ITINERARY[currentDayIndex];
  const isTripStarted = daysLeft === 0;

  const openInGoogleMaps = (loc: string) => {
    window.location.href = `comgooglemaps://?q=${encodeURIComponent(loc)}`;
    setTimeout(() => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`, '_blank');
    }, 500);
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">2026 日本行</h1>
        <p className="text-slate-500 font-medium">{todayStr}</p>
      </header>

      {/* Countdown Card */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-8 text-white shadow-xl shadow-red-200 mb-8 overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-red-100 font-medium mb-1">{isTripStarted ? '旅程進行中' : '距離出發還有'}</p>
          <div className="flex items-baseline">
            <span className="text-6xl font-black">{isTripStarted ? `Day ${currentDayIndex + 1}` : daysLeft}</span>
            <span className="text-2xl font-bold ml-2">{isTripStarted ? '' : '天'}</span>
          </div>
          <p className="mt-4 text-red-50 font-semibold flex items-center bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full text-xs">
             2026.01.24 - 01.31
          </p>
        </div>
        <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-10">
           <Zap size={200} />
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 text-slate-800">快速導覽</h2>
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('itinerary')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:bg-slate-50 transition-colors"
        >
          <div className="bg-blue-50 p-3 rounded-xl mb-3">
            <Calendar className="text-blue-500" size={24} />
          </div>
          <span className="font-bold text-slate-800">每日行程表</span>
          <span className="text-xs text-slate-400 mt-1">Day {currentDayIndex + 1} 進行中</span>
        </button>

        <button 
          onClick={() => onNavigate('weather')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:bg-slate-50 transition-colors"
        >
          <div className="bg-amber-50 p-3 rounded-xl mb-3">
            <Wind className="text-amber-500" size={24} />
          </div>
          <span className="font-bold text-slate-800">天氣與穿著</span>
          <span className="text-xs text-slate-400 mt-1">地點同步更新</span>
        </button>

        <button 
          onClick={() => onNavigate('map')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:bg-slate-50 transition-colors"
        >
          <div className="bg-emerald-50 p-3 rounded-xl mb-3">
            <MapPin className="text-emerald-500" size={24} />
          </div>
          <span className="font-bold text-slate-800">地點導航</span>
          <span className="text-xs text-slate-400 mt-1">共 {ITINERARY.reduce((acc, d) => acc + d.events.length, 0)} 個座標</span>
        </button>

        <button 
          onClick={() => onNavigate('ai')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:bg-slate-50 transition-colors"
        >
          <div className="bg-purple-50 p-3 rounded-xl mb-3">
            <MessageSquare className="text-purple-500" size={24} />
          </div>
          <span className="font-bold text-slate-800">旅伴 AI</span>
          <span className="text-xs text-slate-400 mt-1">隨時問旅遊資訊</span>
        </button>
      </div>

      {/* Today Preview - Fully Linked to Itinerary Locations */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {isTripStarted ? '今日行程亮點' : `Day ${currentDayIndex + 1} 搶先看`}
          </h2>
          <button onClick={() => onNavigate('itinerary')} className="text-red-500 text-xs font-bold flex items-center">
            完整行程 <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
           <div className="flex items-center mb-4 pb-4 border-b border-slate-50">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 mr-4 flex-shrink-0">
                <img 
                  src={`https://picsum.photos/seed/${currentPlan.title}/200/200`} 
                  alt="Destination" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                  {currentPlan.date.split('-')[1]}/{currentPlan.date.split('-')[2]} {currentPlan.dayOfWeek}
                </p>
                <h3 className="font-black text-slate-900 text-lg leading-tight">{currentPlan.title}</h3>
              </div>
           </div>

           <div className="space-y-4">
              {currentPlan.events.slice(0, 3).map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => openInGoogleMaps(event.location)}
                  className="flex items-start group active:opacity-60 transition-all cursor-pointer"
                >
                  <div className="text-[10px] font-black text-slate-400 w-10 pt-1">{event.time}</div>
                  <div className="flex-grow ml-2">
                    <p className="font-bold text-slate-800 text-sm group-hover:text-red-500 transition-colors">{event.activity}</p>
                    <div className="flex items-center text-slate-400 text-[10px] mt-0.5">
                      <MapPin size={8} className="mr-1" />
                      <span className="truncate max-w-[150px]">{event.location}</span>
                    </div>
                  </div>
                  <Navigation size={14} className="text-slate-200 mt-1" />
                </div>
              ))}
              {currentPlan.events.length > 3 && (
                <p className="text-center text-xs font-bold text-slate-300 pt-2 italic">
                  查看剩餘 {currentPlan.events.length - 3} 個行程...
                </p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
