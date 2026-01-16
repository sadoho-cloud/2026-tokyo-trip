
import React, { useState } from 'react';
import { FLIGHT_INFO, HOTEL_INFO } from '../constants';
import { Plane, Hotel, Phone, PieChart, ChevronRight, DollarSign, Plus, Utensils, Bus, ShoppingBag } from 'lucide-react';

const ToolsView: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'info' | 'budget'>('info');

  const emergencyContacts = [
    { name: '日本報警', number: '110', note: '緊急報案' },
    { name: '日本救護車', number: '119', note: '火災/急救' },
    { name: '台北駐日經濟文化代表處', number: '+81-3-3280-7811', note: '白金台站附近' },
    { name: '外交部急難救助專線', number: '0800-085-095', note: '24小時' }
  ];

  const mockExpenses = [
    { id: '1', item: 'Suica 儲值', amount: 5000, category: '交通' },
    { id: '2', item: '阿夫利拉麵', amount: 1200, category: '餐飲' },
    { id: '3', item: '藥妝店', amount: 8500, category: '購物' }
  ];

  return (
    <div className="p-6">
      <div className="flex bg-slate-200 p-1 rounded-2xl mb-8">
        <button 
          onClick={() => setActiveSubView('info')}
          className={`flex-grow py-2 rounded-xl text-sm font-bold transition-all ${activeSubView === 'info' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          旅途資訊
        </button>
        <button 
          onClick={() => setActiveSubView('budget')}
          className={`flex-grow py-2 rounded-xl text-sm font-bold transition-all ${activeSubView === 'budget' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          記帳預算
        </button>
      </div>

      {activeSubView === 'info' ? (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <Plane className="mr-2 text-blue-500" size={20} />
              航班資訊
            </h3>
            <div className="space-y-3">
              {[FLIGHT_INFO.departure, FLIGHT_INFO.return].map((f, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">{f.flight}</span>
                    <span className="text-xs font-bold text-slate-400">Gate: {f.gate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-2xl font-black text-slate-900">{f.time}</p>
                      <p className="text-xs text-slate-500">{f.from}</p>
                    </div>
                    <div className="flex flex-col items-center flex-grow px-4">
                      <div className="w-full h-px bg-slate-100 relative">
                        <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-slate-900">--:--</p>
                      <p className="text-xs text-slate-500">{f.to}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <Hotel className="mr-2 text-indigo-500" size={20} />
              住宿資訊
            </h3>
            <div className="space-y-3">
              {HOTEL_INFO.map((h, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">{h.name}</h4>
                    <span className="text-[10px] font-black text-slate-400">{h.dates}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{h.address}</p>
                  <p className="text-xs font-bold text-blue-500">{h.phone}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <Phone className="mr-2 text-red-500" size={20} />
              緊急聯絡
            </h3>
            <div className="bg-slate-900 rounded-3xl p-5 text-white">
              {emergencyContacts.map((c, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm font-bold">{c.name}</p>
                    <p className="text-[10px] text-slate-500">{c.note}</p>
                  </div>
                  <a href={`tel:${c.number}`} className="text-sm font-black text-red-400">{c.number}</a>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <PieChart size={24} className="text-red-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">總覽預算</span>
            </div>
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-medium mb-1">目前總花費</p>
              <h2 className="text-4xl font-black">¥ 14,700</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 mb-1">剩餘預算</p>
                <p className="text-sm font-bold">¥ 85,300</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 mb-1">今日花費</p>
                <p className="text-sm font-bold">¥ 9,700</p>
              </div>
            </div>
          </div>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">支出明細</h3>
              <button className="bg-red-500 p-2 rounded-full text-white shadow-lg shadow-red-200">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {mockExpenses.map((exp) => (
                <div key={exp.id} className="bg-white p-4 rounded-2xl flex items-center shadow-sm border border-slate-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    exp.category === '餐飲' ? 'bg-orange-100 text-orange-500' :
                    exp.category === '交通' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'
                  }`}>
                    {exp.category === '餐飲' ? <Utensils size={18} /> : exp.category === '交通' ? <Bus size={18} /> : <ShoppingBag size={18} />}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-800">{exp.item}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{exp.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">¥ {exp.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ToolsView;
