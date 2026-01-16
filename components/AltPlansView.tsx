
import React from 'react';
import { ITINERARY } from '../constants';
import { ListChecks, AlertCircle, ShoppingBag, Map as MapIcon } from 'lucide-react';

const AltPlansView: React.FC = () => {
  const allBackups = ITINERARY.filter(d => d.backupPlans && d.backupPlans.length > 0);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">備選行程與清單</h1>
        <p className="text-slate-500 font-medium">彈性調整你的旅行計畫</p>
      </header>

      <div className="space-y-6">
        {/* Important Notes */}
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl">
          <div className="flex items-center mb-2">
            <AlertCircle className="text-amber-500 mr-2" size={20} />
            <h3 className="font-bold text-amber-800">出發前檢查</h3>
          </div>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-center"><span className="mr-2">✓</span> 確認 Visit Japan Web 申報 QR Code</li>
            <li className="flex items-center"><span className="mr-2">✓</span> 確認交通票券（Suica / JR Pass）已加入 Apple Wallet</li>
            <li className="flex items-center"><span className="mr-2">✓</span> 確認飯店預約憑證</li>
          </ul>
        </div>

        {/* Daily Backup Lists */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
             <ListChecks className="mr-2 text-red-500" size={20} />
             每日備選活動
          </h2>
          {allBackups.map((day, idx) => (
            <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-800">{day.date.split('-')[1]}/{day.date.split('-')[2]} {day.dayOfWeek}</h4>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">備選</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {day.backupPlans?.map((p, i) => (
                  <div key={i} className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3"></span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Wishlist Example */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white">
          <div className="flex items-center mb-4">
            <ShoppingBag className="text-red-500 mr-2" size={20} />
            <h3 className="text-lg font-bold">代購/購物清單</h3>
          </div>
          <div className="space-y-3 opacity-80 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>龍角散/藥妝</span>
              <span className="text-slate-500">松本清</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Uniqlo 冬裝</span>
              <span className="text-slate-500">銀座旗艦店</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>藍瓶咖啡豆</span>
              <span className="text-slate-500">新宿/澀谷</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltPlansView;
