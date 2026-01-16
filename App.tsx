
import React, { useState } from 'react';
import { Home, Calendar, MapPin, Briefcase, ListChecks } from 'lucide-react';
import HomeView from './components/HomeView';
import ItineraryView from './components/ItineraryView';
import MapView from './components/MapView';
import WeatherView from './components/WeatherView';
import AltPlansView from './components/AltPlansView';
import ToolsView from './components/ToolsView';

enum View {
  HOME = 'home',
  ITINERARY = 'itinerary',
  MAP = 'map',
  WEATHER = 'weather',
  ALT = 'alt',
  TOOLS = 'tools'
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.HOME);

  const renderView = () => {
    switch (activeView) {
      case View.HOME: return <HomeView onNavigate={(v: string) => setActiveView(v as View)} />;
      case View.ITINERARY: return <ItineraryView />;
      case View.MAP: return <MapView />;
      case View.WEATHER: return <WeatherView />;
      case View.ALT: return <AltPlansView />;
      case View.TOOLS: return <ToolsView />;
      default: return <HomeView onNavigate={(v: string) => setActiveView(v as View)} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 relative">
      <main className="flex-grow overflow-y-auto pb-24 safe-area-top">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 safe-area-bottom z-50">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => setActiveView(View.HOME)} className={`flex flex-col items-center justify-center w-full h-full ${activeView === View.HOME ? 'text-red-500' : 'text-slate-400'}`}>
            <Home size={20} />
            <span className="text-[10px] mt-1 font-medium">首頁</span>
          </button>
          <button onClick={() => setActiveView(View.ITINERARY)} className={`flex flex-col items-center justify-center w-full h-full ${activeView === View.ITINERARY ? 'text-red-500' : 'text-slate-400'}`}>
            <Calendar size={20} />
            <span className="text-[10px] mt-1 font-medium">行程</span>
          </button>
          <button onClick={() => setActiveView(View.MAP)} className={`flex flex-col items-center justify-center w-full h-full ${activeView === View.MAP ? 'text-red-500' : 'text-slate-400'}`}>
            <MapPin size={20} />
            <span className="text-[10px] mt-1 font-medium">地圖</span>
          </button>
          <button onClick={() => setActiveView(View.ALT)} className={`flex flex-col items-center justify-center w-full h-full ${activeView === View.ALT ? 'text-red-500' : 'text-slate-400'}`}>
            <ListChecks size={20} />
            <span className="text-[10px] mt-1 font-medium">備忘</span>
          </button>
          <button onClick={() => setActiveView(View.TOOLS)} className={`flex flex-col items-center justify-center w-full h-full ${activeView === View.TOOLS ? 'text-red-500' : 'text-slate-400'}`}>
            <Briefcase size={20} />
            <span className="text-[10px] mt-1 font-medium">工具</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
