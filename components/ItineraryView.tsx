
import React, { useState, useEffect } from 'react';
import { ITINERARY } from '../constants';
import { gemini } from '../services/geminiService';
import { MapPin, Bus, Utensils, Hotel, ShoppingBag, Camera, Sun, Cloud, Snowflake, Droplets, Bookmark, Loader2, Zap, Edit3, Pin } from 'lucide-react';

const ItineraryView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [liveWeather, setLiveWeather] = useState<Record<number, any>>({});
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [userReminders, setUserReminders] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");

  const day = ITINERARY[selectedDay];

  useEffect(() => {
    const saved = localStorage.getItem('japan_trip_reminders');
    if (saved) {
      try { setUserReminders(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('japan_trip_reminders', JSON.stringify(userReminders));
  }, [userReminders]);

  useEffect(() => {
    const fetchLiveWeather = async () => {
      if (liveWeather[selectedDay]) return;
      setLoadingWeather(true);
      const searchLoc = day.title.includes('輕井澤') ? 'Karuizawa' : 
                        day.title.includes('橫濱') ? 'Yokohama' : 
                        day.title.includes('台場') ? 'Odaiba Tokyo' : 'Tokyo';
      const advice = await gemini.getWeatherAdvice(day.date, searchLoc);
      setLiveWeather(prev => ({ ...prev, [selectedDay]: advice }));
      setLoadingWeather(false);
    };
    fetchLiveWeather();
  }, [selectedDay, day]);

  const handleSaveReminder = (id: string) => {
    setUserReminders(prev => ({ ...prev, [id]: tempNote }));
    setEditingId(null);
    setTempNote("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Bus className="text-blue-500" size={16} />;
      case 'meal': return <Utensils className="text-orange-500" size={16} />;
      case 'hotel': return <Hotel className="text-indigo-500" size={16} />;
      case 'shopping': return <ShoppingBag className="text-pink-500" size={16} />;
      default: return <Camera className="text-emerald-500" size={16} />;
    }
  };

  const getWeatherIcon = (icon: string, size: number = 24, active: boolean = false) => {
    const colorClass = active ? 'text-white' : 
                      icon === 'sun' ? 'text-amber-400' :
                      icon === 'snow' ? 'text-blue-300' :
                      icon === 'rain' ? 'text-blue-400' : 'text-slate-400';
    
    switch (icon) {
      case 'snow': return <Snowflake className={colorClass} size={size} />;
      case 'rain': return <Droplets className={colorClass} size={size} />;
      case 'cloud': return <Cloud className={colorClass} size={size} />;
      default: return <Sun className={colorClass} size={size} />;
    }
  };

  const openGoogleMaps = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const currentWeather = liveWeather[selectedDay] || day.weather;

  // 格式化主題文字以適應極窄空間
  const getDisplayTheme = (fullTitle: string) => {
    const parts = fullTitle.split('：');
    const core = parts.length > 1 ? parts[1] : fullTitle;
    return core.length > 6 ? core.substring(0, 5) + '..' : core;
  };

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* 1. 8 欄位一目了然導覽區 (窄長垂直設計 + 星期幾) */}
      <div className="sticky top-0 bg-white z-40 border-b border-slate-200 safe-area-top shadow-sm">
        <div className="grid grid-cols-8 gap-0.5 p-1 h-36">
          {ITINERARY.map((d, idx) => {
            const isSelected = selectedDay === idx;
            const displayWeather = liveWeather[idx] || d.weather;
            
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(idx)}
                className={`flex flex-col items-center justify-start py-2 rounded-lg transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'bg-red-500 text-white shadow-inner scale-[1.02] z-10' 
                    : 'bg-white text-slate-400 border border-slate-50 hover:bg-slate-50'
                }`}
              >
                {/* 星期幾 (新增) */}
                <span className={`text-[7px] font-bold uppercase tracking-tighter mb-0.5 ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                  {d.dayOfWeek}
                </span>

                {/* 日期數字 */}
                <span className={`text-[11px] font-black leading-none mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {d.date.split('-')[2]}
                </span>
                
                {/* 天氣圖示 */}
                <div className="my-1 flex flex-col items-center">
                  {getWeatherIcon(displayWeather?.icon || 'sun', 14, isSelected)}
                  <span className={`text-[7px] font-bold mt-0.5 ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                    {displayWeather?.temp.split('/')[0]}
                  </span>
                </div>

                {/* 主題文字 - 垂直排列 */}
                <div className={`mt-auto flex flex-col items-center justify-end w-full px-0.5 pb-1`}>
                  <p className={`text-[9px] font-bold leading-[1.1] text-center break-words ${isSelected ? 'text-white' : 'text-slate-600'}`} style={{ writingMode: 'vertical-lr' }}>
                    {getDisplayTheme(d.title)}
                  </p>
                </div>
                
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 2. 當日詳情標題卡 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 card-flat flex justify-between items-center shadow-sm">
          <div className="flex-grow pr-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Day {selectedDay + 1}</span>
              <span className="text-[10px] font-bold text-slate-400">{day.date} ({day.dayOfWeek})</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{day.title}</h2>
          </div>
          
          <div className="flex flex-col items-end border-l border-slate-100 pl-4 min-w-[80px]">
            {loadingWeather ? (
              <Loader2 className="animate-spin text-slate-200" size={20} />
            ) : (
              <div className="flex flex-col items-center">
                {getWeatherIcon(currentWeather?.icon, 28, false)}
                <span className="text-sm font-bold text-slate-800 mt-1">{currentWeather?.temp}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">{currentWeather?.condition}</span>
              </div>
            )}
          </div>
        </div>

        {/* AI 穿著建議 */}
        {!loadingWeather && currentWeather?.suggestion && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start">
            <Zap size={14} className="text-amber-500 mr-2 mt-0.5 shrink-0 fill-amber-500" />
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              <span className="font-bold text-slate-800">穿著建議：</span>{currentWeather.suggestion}
            </p>
          </div>
        )}

        {/* 3. 行程軸內容 */}
        <div className="relative pl-1 pt-2">
          <div className="absolute left-[17px] top-6 bottom-6 w-px bg-slate-200"></div>
          <div className="space-y-6">
            {day.events.map((event) => {
              const userNote = userReminders[event.id];
              const isEditing = editingId === event.id;

              return (
                <div key={event.id} className="relative z-10 flex">
                  <div className="flex-shrink-0 w-9 flex flex-col items-center pt-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm">
                      {getIcon(event.type)}
                    </div>
                  </div>

                  <div className="ml-4 flex-grow">
                    <div className={`p-4 rounded-2xl border transition-all bg-white shadow-sm relative ${
                      isEditing ? 'border-blue-500 ring-2 ring-blue-50' : 'border-slate-100'
                    }`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-400">{event.time}</span>
                        {event.bookingCode && (
                          <span className="bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center">
                            <Bookmark size={8} className="mr-1" /> {event.bookingCode}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-slate-800 text-base leading-snug mb-2">{event.activity}</h3>
                      
                      <div className="flex items-center text-slate-500 text-[11px] mb-3" onClick={() => openGoogleMaps(event.location)}>
                        <MapPin size={10} className="mr-1 text-slate-400" />
                        <span className="truncate border-b border-slate-200 pb-0.5">{event.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {event.highlights && event.highlights.map((h, i) => (
                          <div key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            h.type === 'food' ? 'bg-red-50 text-red-600 border border-red-100' :
                            h.type === 'souvenir' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {h.text}
                          </div>
                        ))}

                        {userNote && !isEditing && (
                          <div className="flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white shadow-sm">
                            <Pin size={8} className="mr-1 fill-white" />
                            提醒: {userNote}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => { setEditingId(event.id); setTempNote(userNote || ""); }}
                        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-colors ${userNote ? 'text-blue-500 bg-blue-50' : 'text-slate-300 hover:text-slate-400'}`}
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>

                    {isEditing && (
                      <div className="mt-2 bg-white border border-blue-400 p-3 rounded-xl shadow-lg z-50">
                        <textarea
                          autoFocus
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          className="w-full text-sm border-0 focus:ring-0 bg-slate-50 rounded-lg p-3 h-16 mb-2"
                          placeholder="記下重要事項..."
                        />
                        <div className="flex space-x-2">
                          <button onClick={() => handleSaveReminder(event.id)} className="flex-grow bg-blue-600 text-white font-bold text-xs py-2 rounded-lg">儲存</button>
                          <button onClick={() => setEditingId(null)} className="px-4 bg-slate-100 text-slate-500 font-bold text-xs py-2 rounded-lg">取消</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
