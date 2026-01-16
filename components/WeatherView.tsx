
import React, { useState, useEffect, useCallback } from 'react';
import { CITY_COORDS } from '../constants';
import { gemini } from '../services/geminiService';
import { Cloud, Sun, Thermometer, MapPin, Snowflake, Droplets, RefreshCcw, Wifi, CloudRain, CloudLightning, Wind, ChevronRight } from 'lucide-react';

interface RealTimeWeather {
  city: string;
  temp: number;
  conditionCode: number;
  humidity: number;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  dayName: string;
}

const WeatherView: React.FC = () => {
  const [liveData, setLiveData] = useState<RealTimeWeather[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getDayName = (dateStr: string) => {
    const days = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    return days[new Date(dateStr).getDay()];
  };

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. 抓取三大城市目前的即時氣溫
      const liveResults = await Promise.all(
        Object.values(CITY_COORDS).map(async (city) => {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&relative_humidity_2m=true`
          );
          const data = await res.json();
          return {
            city: city.name,
            temp: Math.round(data.current_weather.temperature),
            conditionCode: data.current_weather.weathercode,
            humidity: data.relative_humidity_2m || 0,
          };
        })
      );
      setLiveData(liveResults);

      // 2. 抓取東京未來 7 天的動態預報
      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${CITY_COORDS.tokyo.lat}&longitude=${CITY_COORDS.tokyo.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`
      );
      const forecastData = await forecastRes.json();
      
      const formattedForecast = forecastData.daily.time.map((time: string, i: number) => ({
        date: time.split('-').slice(1).join('/'),
        maxTemp: Math.round(forecastData.daily.temperature_2m_max[i]),
        minTemp: Math.round(forecastData.daily.temperature_2m_min[i]),
        weatherCode: forecastData.daily.weathercode[i],
        dayName: getDayName(time)
      }));
      setForecast(formattedForecast);

      // 3. 獲取 AI 旅遊穿著建議
      const todayForecast = formattedForecast[0];
      const advice = await gemini.askTravelGuide(`目前東京預報是 ${todayForecast.minTemp}°C - ${todayForecast.maxTemp}°C，天氣代碼為 ${todayForecast.weatherCode}。請給予一段 50 字內的穿著與旅遊建議。`);
      setAiAdvice(advice.text);

    } catch (error) {
      console.error('Weather Sync Failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const getWeatherIcon = (code: number, size: number = 24) => {
    if (code === 0) return <Sun className="text-amber-400" size={size} />;
    if (code >= 1 && code <= 3) return <Cloud className="text-slate-300" size={size} />;
    if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" size={size} />;
    if (code >= 71 && code <= 77) return <Snowflake className="text-cyan-200" size={size} />;
    if (code >= 80 && code <= 82) return <Droplets className="text-blue-500" size={size} />;
    if (code >= 95) return <CloudLightning className="text-indigo-400" size={size} />;
    return <Cloud className="text-slate-400" size={size} />;
  };

  return (
    <div className="p-5 space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Live Weather</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">即時連網氣象預報系統</p>
        </div>
        <button 
          onClick={fetchWeatherData} 
          disabled={loading}
          className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-90 transition-all"
        >
          <RefreshCcw size={18} className={`${loading ? 'animate-spin text-red-500' : 'text-slate-400'}`} />
        </button>
      </header>

      {/* 1. 三大城市現況 */}
      <section className="grid grid-cols-3 gap-3">
        {loading ? [1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border border-slate-50"></div>) : 
          liveData.map((data, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 mb-2 uppercase">{data.city}</span>
              {getWeatherIcon(data.conditionCode, 28)}
              <span className="text-xl font-black text-slate-900 mt-2">{data.temp}°</span>
              <div className="flex items-center mt-1 text-[8px] font-bold text-slate-300">
                <Wind size={8} className="mr-0.5" /> {data.humidity}%
              </div>
            </div>
          ))
        }
      </section>

      {/* 2. AI 穿著建議卡片 */}
      <section className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Thermometer size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">AI Travel Advice</span>
          </div>
          <p className="text-sm font-medium leading-relaxed italic text-slate-200">
            {loading ? "AI 正在分析預報數據中..." : aiAdvice || "根據預報，建議採用層狀穿法（發熱衣+毛衣+防風外套），注意保暖。"}
          </p>
        </div>
      </section>

      {/* 3. 未來 7 天預報清單 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Wifi size={12} className="text-emerald-500" />
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">7-Day Forecast (Tokyo)</h2>
          </div>
        </div>

        <div className="space-y-2">
          {loading ? [1,2,3,4,5].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-slate-50"></div>) : 
            forecast.map((day, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-red-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase leading-none">{day.dayName}</p>
                    <p className="text-xs font-bold text-slate-600 mt-1">{day.date}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-red-50 transition-colors">
                    {getWeatherIcon(day.weatherCode, 20)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-800">{day.maxTemp}°</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-sm font-bold text-slate-400">{day.minTemp}°</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-200" />
                </div>
              </div>
            ))
          }
        </div>
      </section>

      {/* Footer Disclaimer */}
      <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
        Data provided by Open-Meteo & Gemini AI • Real-time Sync
      </p>
    </div>
  );
};

export default WeatherView;
