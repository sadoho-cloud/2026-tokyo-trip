
import React, { useState, useEffect } from 'react';
import { ITINERARY, CITY_COORDS } from '../constants';
import { Cloud, Sun, Thermometer, CheckCircle2, MapPin, Snowflake, Droplets, RefreshCcw, Wifi } from 'lucide-react';

interface RealTimeWeather {
  city: string;
  temp: number;
  conditionCode: number;
  humidity: number;
}

const WeatherView: React.FC = () => {
  const [liveData, setLiveData] = useState<RealTimeWeather[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveWeather = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        Object.values(CITY_COORDS).map(async (city) => {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&relative_humidity_2m=true`
          );
          const data = await res.json();
          return {
            city: city.name,
            temp: data.current_weather.temperature,
            conditionCode: data.current_weather.weathercode,
            humidity: data.current_weather.relative_humidity_2m || 0
          };
        })
      );
      setLiveData(results);
    } catch (error) {
      console.error('Failed to fetch live weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, []);

  const getWeatherIcon = (icon: string | number) => {
    // Handle Open-Meteo WMO Codes
    if (typeof icon === 'number') {
      if (icon === 0) return <Sun className="text-amber-400" size={32} />;
      if (icon <= 3) return <Cloud className="text-slate-300" size={32} />;
      if (icon >= 71 && icon <= 77) return <Snowflake className="text-blue-200" size={32} />;
      if (icon >= 51) return <Droplets className="text-blue-400" size={32} />;
      return <Cloud className="text-slate-400" size={32} />;
    }

    // Handle string icons from constants
    switch (icon) {
      case 'snow': return <Snowflake className="text-blue-300" size={32} />;
      case 'rain': return <Droplets className="text-blue-400" size={32} />;
      case 'cloud': return <Cloud className="text-slate-300" size={32} />;
      default: return <Sun className="text-amber-400" size={32} />;
    }
  };

  const getStaticSuggestion = (title: string) => {
    if (title.includes('輕井澤')) return "山區溫差大且有雪。建議穿著發熱衣、羊毛衫搭配長版厚羽絨外套。防滑雪靴與手套必備。";
    if (title.includes('台場') || title.includes('橫濱')) return "海邊風大體感冷。建議穿著防風外套與圍巾。";
    return "東京冬季乾燥寒冷，建議穿著保暖衣物並注意皮膚保濕。";
  };

  return (
    <div className="p-5 space-y-6 pb-24">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">氣候資訊</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Weather Dashboard</p>
        </div>
        <button 
          onClick={fetchLiveWeather} 
          disabled={loading}
          className="p-2 bg-white rounded-full border border-slate-100 shadow-sm active:scale-90 transition-transform"
        >
          <RefreshCcw size={14} className={`${loading ? 'animate-spin' : ''} text-slate-400`} />
        </button>
      </header>

      {/* 1. 即時日本看板 (無需 Key) */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">日本實況連線</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>)
          ) : (
            liveData.map((data, i) => (
              <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 mb-2">{data.city}</span>
                {getWeatherIcon(data.conditionCode)}
                <span className="text-lg font-black text-slate-900 mt-2">{data.temp}°</span>
                <span className="text-[8px] font-bold text-slate-300 uppercase">Humidity {data.humidity}%</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 2. 行程預測區 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-1 pt-2">
          <Wifi size={10} className="text-slate-300" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">行程日期預覽 (2026)</span>
        </div>

        {ITINERARY.map((w, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 card-flat relative shadow-sm">
            <div className="absolute top-4 right-5 text-[10px] font-bold text-slate-300 uppercase">
              Day {idx + 1}
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center text-slate-400 mb-0.5">
                  <MapPin size={10} className="mr-1" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{w.title.split('：')[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {w.date.split('-')[1]}/{w.date.split('-')[2]} <span className="text-slate-300 ml-1 font-medium">{w.dayOfWeek}</span>
                </h3>
              </div>
              <div className="flex flex-col items-end">
                {getWeatherIcon(w.weather?.icon || 'sun')}
                <div className="text-lg font-bold text-slate-800 mt-1">{w.weather?.temp}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-start border border-slate-50">
              <CheckCircle2 size={14} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                {getStaticSuggestion(w.title)}
              </p>
            </div>
          </div>
        ))}

        <div className="bg-slate-900 rounded-3xl p-6 text-white card-shadow">
          <h3 className="font-bold mb-4 flex items-center text-sm uppercase tracking-widest">
            <Thermometer className="text-red-500 mr-2" size={18} />
            冬季行李清單
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {['極暖發熱衣', '防滑雪靴', '羊毛圍巾', '高保濕乳液', '暖暖包', '防風手套'].map(item => (
              <div key={item} className="text-xs font-bold text-slate-300 flex items-center">
                <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherView;
