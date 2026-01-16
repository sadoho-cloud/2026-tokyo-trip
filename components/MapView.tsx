
import React, { useState } from 'react';
import { ITINERARY } from '../constants';
import { MapPin, Navigation, ExternalLink, Calendar } from 'lucide-react';

const MapView: React.FC = () => {
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');

  const openInGoogleMaps = (loc: string) => {
    window.location.href = `comgooglemaps://?q=${encodeURIComponent(loc)}`;
    // Fallback if app not installed
    setTimeout(() => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`, '_blank');
    }, 500);
  };

  const filteredLocations = ITINERARY.flatMap((day, dayIdx) => 
    day.events.map(e => ({
      dayIdx,
      date: day.date,
      dayOfWeek: day.dayOfWeek,
      activity: e.activity,
      location: e.location,
      type: e.type
    }))
  ).filter(loc => activeDayFilter === 'all' || loc.dayIdx === activeDayFilter);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">景點地圖整合</h1>
        <p className="text-slate-500 font-medium">點擊後將跳轉至 Google Maps 導航</p>
      </header>

      {/* Map Illustration / Placeholder */}
      <div className="bg-slate-200 w-full h-40 rounded-3xl mb-6 relative overflow-hidden shadow-inner">
        <img 
          src="https://picsum.photos/seed/japan-map/800/400" 
          alt="Map" 
          className="w-full h-full object-cover opacity-60 grayscale blur-[2px]" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl flex items-center border border-white">
             <Navigation className="text-red-500 mr-2" />
             <span className="font-bold text-slate-800">共 {filteredLocations.length} 個座標點</span>
          </div>
        </div>
      </div>

      {/* Day Selector Chips */}
      <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-6 pb-2">
        <button
          onClick={() => setActiveDayFilter('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            activeDayFilter === 'all' 
            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
            : 'bg-white text-slate-500 border-slate-100'
          }`}
        >
          全部
        </button>
        {ITINERARY.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayFilter(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              activeDayFilter === idx 
              ? 'bg-red-500 text-white border-red-500 shadow-md' 
              : 'bg-white text-slate-500 border-slate-100'
            }`}
          >
            Day {idx + 1}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((item, i) => (
            <button
              key={i}
              onClick={() => openInGoogleMaps(item.location)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center text-left hover:border-red-200 transition-all active:scale-[0.98]"
            >
              <div className={`p-3 rounded-xl mr-4 ${
                item.type === 'transport' ? 'bg-blue-50 text-blue-500' :
                item.type === 'meal' ? 'bg-orange-50 text-orange-500' :
                item.type === 'hotel' ? 'bg-indigo-50 text-indigo-500' :
                'bg-slate-50 text-red-500'
              }`}>
                <MapPin size={20} />
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Day {item.dayIdx + 1}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.date}</span>
                </div>
                <p className="font-bold text-slate-800 truncate">{item.activity}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.location}</p>
              </div>
              <ExternalLink size={14} className="text-slate-200 ml-2 flex-shrink-0" />
            </button>
          ))
        ) : (
          <div className="text-center py-10">
            <Calendar className="mx-auto text-slate-200 mb-2" size={40} />
            <p className="text-slate-400 font-medium">目前沒有符合的地點</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
