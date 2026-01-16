
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
      for (let i = 0; i < ITINERARY.length; i++) {
        const day = ITINERARY[i];
        const locationContext = day.title.includes('輕井澤') ? 'Karuizawa' : 
                               day.title.includes('橫濱') ? 'Yokohama' : 
                               day.title.includes('台場') ? 'Odaiba Tokyo' : 'Tokyo Japan';
        try {
          const advice = await gemini.getWeatherAdvice(day.date, locationContext);
          results.push({
            date: day.date,
            dayOfWeek: day.dayOfWeek,
            locationName: day.title.split('：')[0],
            ...advice
          });
        } catch (e) {
          results.push({
            date: day.date,
            dayOfWeek: day.dayOfWeek,
            locationName: day.title.split('：')[0],
            temp: "--/--",
            condition: "Error",
            suggestion: "連線異常",
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
      case 'cloud': return <Cloud className="text-slate-300" size={32} />;
      default: return <Sun className="text-amber-400" size={32} />;
    }
  };

  return (
    <div className="p-5 space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">天氣預測</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">同步 8 天行程資訊</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-red-500" size={32} />
          <p className="text-slate-400 font-bold text-xs uppercase animate-pulse">正在更新氣象預報...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {weatherData.map((w, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 card-shadow relative">
              <div className="absolute top-4 right-5 text-[10px] font-bold text-slate-300 uppercase">
                Day {idx + 1}
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center text-slate-400 mb-0.5">
                    <MapPin size={10} className="mr-1" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{w.locationName}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {w.date.split('-')[1]}/{w.date.split('-')[2]} <span className="text-slate-300 ml-1 font-medium">{w.dayOfWeek}</span>
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  {getWeatherIcon(w.icon)}
                  <div className="text-lg font-bold text-slate-800 mt-1">{w.temp}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex items-start border border-slate-50">
                <CheckCircle2 size={14} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                  {w.suggestion}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-slate-900 rounded-3xl p-6 text-white card-shadow">
            <h3 className="font-bold mb-4 flex items-center text-sm uppercase tracking-widest">
              <Thermometer className="text-red-500 mr-2" size={18} />
              冬季穿著清單
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['極暖發熱衣', '羊毛圍巾', '防風手套', '高保濕乳液'].map(item => (
                <div key={item} className="text-xs font-bold text-slate-300 flex items-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                  {item}
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
