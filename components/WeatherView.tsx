
import React, { useState, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { ITINERARY } from '../constants';
import { Cloud, Sun, Thermometer, Umbrella, CheckCircle2, Loader2, MapPin, Snowflake, Droplets } from 'lucide-react';

const WeatherView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const results = [];
      
      // Fetch weather for all days in the itinerary to stay synchronized
      for (let i = 0; i < ITINERARY.length; i++) {
        const day = ITINERARY[i];
        // Extract a clean location name from the title (e.g., "東京", "橫濱", "輕井澤")
        const locationContext = day.title.includes('輕井澤') ? 'Karuizawa' : 
                               day.title.includes('橫濱') ? 'Yokohama' : 
                               day.title.includes('台場') ? 'Odaiba Tokyo' : 'Tokyo Japan';
        
        try {
          const advice = await gemini.getWeatherAdvice(day.date, locationContext);
          results.push({
            date: day.date,
            dayOfWeek: day.dayOfWeek,
            locationName: day.title.split('：')[0], // Use the theme as location label
            ...advice
          });
        } catch (e) {
          results.push({
            date: day.date,
            dayOfWeek: day.dayOfWeek,
            locationName: day.title.split('：')[0],
            temp: "--/--",
            condition: "查詢失敗",
            suggestion: "請確認網路連線。",
            icon: "cloud"
          });
        }
      }
      setWeatherData(results);
      setLoading(false);
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'snow': return <Snowflake className="text-blue-300" size={32} />;
      case 'rain': return <Droplets className="text-blue-400" size={32} />;
      case 'cloud': return <Cloud className="text-slate-400" size={32} />;
      default: return <Sun className="text-amber-400" size={32} />;
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">天氣與穿著建議</h1>
        <p className="text-slate-500 font-medium text-sm">與行程同步：1/24 - 1/31 即時預測</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-red-500 mb-4" size={40} />
          <p className="text-slate-400 font-bold animate-pulse">正在同步 8 天行程氣象...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* General Alert */}
          <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-100 flex items-start">
            <Umbrella className="mr-4 mt-1 flex-shrink-0" />
            <div>
              <p className="font-black text-sm uppercase tracking-widest mb-1 text-blue-100">AI 旅遊叮嚀</p>
              <p className="text-xs font-bold leading-relaxed">
                1月日本室內外溫差極大（暖氣強）。建議採用「洋蔥式穿法」，並準備好防水防滑的鞋具（尤其是輕井澤段）。
              </p>
            </div>
          </div>

          {weatherData.map((w, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
              {/* Day Badge */}
              <div className="absolute top-0 right-0 bg-slate-900 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter">
                Day {idx + 1}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center text-slate-400 mb-1">
                    <MapPin size={12} className="mr-1" />
                    <span className="text-[10px] font-black uppercase">{w.locationName}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {w.date.split('-')[1]}/{w.date.split('-')[2]} ({w.dayOfWeek})
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  {getWeatherIcon(w.icon)}
                  <div className="text-lg font-black text-slate-900 mt-1">{w.temp}</div>
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">{w.condition}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex items-start">
                <CheckCircle2 size={16} className="text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">穿搭與裝備建議</p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                    「 {w.suggestion} 」
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Checklist Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Thermometer className="text-red-500 mr-2" size={20} />
              冬季必備裝備
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: '極暖發熱衣', note: 'Uniqlo超極暖' },
                { name: '羊毛圍巾', note: '防風必備' },
                { name: '暖暖包', note: '貼式/手握' },
                { name: '防滑雪靴', note: '輕井澤用' },
                { name: '高保濕乳液', note: '日本極乾燥' },
                { name: '護唇膏', note: '隨身攜帶' }
              ].map((item) => (
                <div key={item.name} className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200 flex items-center">
                    <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-3">{item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherView;
