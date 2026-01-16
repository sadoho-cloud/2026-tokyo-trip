
import React, { useState, useEffect } from 'react';
import { ITINERARY } from '../constants';
import { gemini } from '../services/geminiService';
import { MapPin, Bus, Utensils, Hotel, ShoppingBag, Camera, Sun, Cloud, Snowflake, Droplets, Tag, Star, Bookmark, Loader2, Zap, Edit3, Pin, Check, X, Info } from 'lucide-react';

const ItineraryView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [liveWeather, setLiveWeather] = useState<Record<number, any>>({});
  const [loadingWeather, setLoadingWeather] = useState(false);
  
  // User reminders state
  const [userReminders, setUserReminders] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");

  const day = ITINERARY[selectedDay];

  // Load reminders from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('japan_trip_reminders');
    if (saved) {
      try {
        setUserReminders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load reminders", e);
      }
    }
  }, []);

  // Save reminders to localStorage when they change
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

  const startEditing = (id: string, currentNote: string) => {
    setEditingId(id);
    setTempNote(currentNote || "");
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

  const getWeatherIcon = (icon: string, size: number = 24, isActive: boolean = false) => {
    const colorClass = isActive ? 'text-white' : '';
    switch (icon) {
      case 'snow': return <Snowflake className={colorClass || "text-blue-300"} size={size} />;
      case 'rain': return <Droplets className={colorClass || "text-blue-400"} size={size} />;
      case 'cloud': return <Cloud className={colorClass || "text-slate-400"} size={size} />;
      default: return <Sun className={colorClass || "text-amber-400"} size={size} />;
    }
  };

  const openGoogleMaps = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const currentWeather = liveWeather[selectedDay] || day.weather;

  return (
    <div className="flex flex-col min-h-full">
      {/* Enhanced Horizontal Scroll Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-slate-100 safe-area-top shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar p-4 space-x-3">
          {ITINERARY.map((d, idx) => {
            const isSelected = selectedDay === idx;
            const theme = d.title.split('：')[0];
            
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(idx)}
                className={`flex-shrink-0 flex flex-col items-center justify-between w-20 h-28 p-2 rounded-2xl transition-all border ${
                  isSelected 
                    ? 'bg-red-500 text-white border-red-600 shadow-lg shadow-red-200 scale-105' 
                    : 'bg-white text-slate-400 border-slate-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-[8px] font-black uppercase tracking-tighter ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                    {d.dayOfWeek}
                  </span>
                  <span className="text-lg font-black leading-none">{d.date.split('-')[2]}</span>
                </div>
                
                <div className="my-1">
                  {getWeatherIcon(d.weather?.icon || 'sun', 20, isSelected)}
                </div>
                
                <span className={`text-[9px] font-bold truncate w-full text-center leading-tight ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                  {theme}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* Day Header with Weather Detail */}
        <div className="flex justify-between items-start mb-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-[70%]">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{day.title}</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">2026 年 {day.date.split('-')[1]}月{day.date.split('-')[2]}日</p>
          </div>
          
          <div className="flex flex-col items-end relative z-10">
            {loadingWeather ? (
              <div className="flex flex-col items-end">
                <Loader2 className="animate-spin text-slate-300" size={24} />
                <span className="text-[8px] text-slate-400 mt-1 uppercase tracking-tighter">Searching...</span>
              </div>
            ) : (
              <>
                {getWeatherIcon(currentWeather?.icon)}
                <span className="text-xs font-bold text-slate-600 mt-1">{currentWeather?.temp}</span>
                <div className="flex items-center">
                  <span className="text-[10px] text-slate-400 mr-1">{currentWeather?.condition}</span>
                  <div className="flex items-center px-1 bg-red-100 rounded text-[8px] font-black text-red-500 animate-pulse">
                    <Zap size={6} className="mr-0.5 fill-red-500" />
                    LIVE
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Advice Alert */}
        {!loadingWeather && currentWeather?.suggestion && (
          <div className="mb-6 bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 flex items-start">
            <div className="mr-3 mt-1 bg-red-500 p-1.5 rounded-xl">
              <Zap size={14} className="fill-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">AI 穿搭與交通建議</p>
              <p className="text-xs font-medium text-slate-200 leading-relaxed">{currentWeather.suggestion}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>

          <div className="space-y-8">
            {day.events.map((event) => {
              const userNote = userReminders[event.id];
              const isEditing = editingId === event.id;

              return (
                <div key={event.id} className="relative z-10 flex flex-col">
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 flex flex-col items-center pt-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                        event.type === 'transport' ? 'bg-blue-50' : 
                        event.type === 'meal' ? 'bg-orange-50' : 
                        event.type === 'shopping' ? 'bg-pink-50' : 'bg-slate-50'
                      }`}>
                        {getIcon(event.type)}
                      </div>
                    </div>

                    <div className="ml-4 flex-grow relative">
                      <div 
                        onClick={() => openGoogleMaps(event.location)}
                        className={`p-5 rounded-3xl shadow-sm border transition-all active:scale-[0.98] ${
                          event.type === 'meal' ? 'bg-orange-50/30 border-orange-100' :
                          event.type === 'transport' ? 'bg-blue-50/30 border-blue-100' :
                          event.type === 'shopping' ? 'bg-pink-50/30 border-pink-100' :
                          'bg-white border-slate-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black text-slate-400">{event.time}</span>
                          {event.bookingCode && (
                            <span className="flex items-center text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-full">
                              <Bookmark size={10} className="mr-1" />
                              預約: {event.bookingCode}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{event.activity}</h3>
                        
                        <div className="flex items-center text-slate-400 text-xs mb-3">
                          <MapPin size={12} className="mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>

                        {/* Combined Highlights and User Reminders */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {/* Default Trip Highlights */}
                          {event.highlights && event.highlights.map((h, i) => (
                            <div key={i} className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-bold ${
                              h.type === 'food' ? 'bg-red-500 text-white' :
                              h.type === 'menu' ? 'bg-amber-100 text-amber-700' :
                              h.type === 'souvenir' ? 'bg-purple-100 text-purple-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {h.type === 'food' && <Star size={10} className="mr-1 fill-white" />}
                              {h.type === 'souvenir' && <Tag size={10} className="mr-1" />}
                              {h.type === 'food' ? '必吃: ' : h.type === 'menu' ? '必點: ' : h.type === 'souvenir' ? '必買: ' : '攻略: '}
                              {h.text}
                            </div>
                          ))}

                          {/* Display User Reminder as a High-Visibility Tag - Refined Style */}
                          {userNote && !isEditing && (
                            <div className="flex items-center px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-600 text-white shadow-sm animate-in fade-in zoom-in duration-300">
                              <Pin size={10} className="mr-1 fill-white rotate-[30deg]" />
                              提醒: {userNote}
                            </div>
                          )}
                        </div>

                        {/* Add/Edit Reminder Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); startEditing(event.id, userNote); }}
                          className={`absolute bottom-4 right-4 p-2 rounded-xl transition-all ${userNote ? 'bg-indigo-50 text-indigo-500 shadow-inner' : 'bg-slate-100 text-slate-500'}`}
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>

                      {/* Reminder Editor Overlay */}
                      {isEditing && (
                        <div className="mt-2 ml-2 bg-white border-2 border-indigo-500 p-4 rounded-2xl shadow-xl z-20">
                          <div className="flex items-center mb-2">
                            <Info size={12} className="text-indigo-500 mr-2" />
                            <p className="text-[10px] font-black text-slate-400 uppercase">設定自訂提醒事項</p>
                          </div>
                          <textarea
                            autoFocus
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            className="w-full text-sm font-medium border-0 focus:ring-0 bg-slate-50 rounded-xl p-3 h-16 mb-3"
                            placeholder="輸入內容（例如：代購清單、寄物櫃號碼）"
                          />
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleSaveReminder(event.id)}
                              className="flex-grow bg-indigo-600 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100"
                            >
                              <Check size={14} className="mr-1" /> 確認儲存
                            </button>
                            <button 
                              onClick={() => { setEditingId(null); setTempNote(""); }}
                              className="px-4 bg-slate-100 text-slate-500 font-bold text-xs py-2 rounded-xl flex items-center justify-center"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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
