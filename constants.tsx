
import { DayPlan } from './types';

export const TRIP_START_DATE = '2026-01-24';
export const TRIP_END_DATE = '2026-01-31';

export const CITY_COORDS = {
  tokyo: { lat: 35.6895, lon: 139.6917, name: '東京' },
  yokohama: { lat: 35.4437, lon: 139.6380, name: '橫濱' },
  karuizawa: { lat: 36.3488, lon: 138.6358, name: '輕井澤' }
};

export const FLIGHT_INFO = {
  departure: {
    flight: 'CI221',
    time: '16:25',
    from: 'TSA 臺北松山',
    to: 'HND 羽田機場',
    gate: 'TBD'
  },
  return: {
    flight: 'CI222',
    time: '12:40',
    from: 'HND 羽田機場',
    to: 'TSA 臺北松山',
    gate: 'TBD'
  }
};

export const HOTEL_INFO = [
  {
    name: '京急蒲田住宅飯店 (Keikyu Kamata)',
    address: '東京都大田區蒲田',
    dates: '01/24 - 01/28',
    phone: '+81 3-xxxx-xxxx'
  },
  {
    name: 'Hotel Grand Vert 舊輕井澤',
    address: '長野縣北佐久郡輕井澤町',
    dates: '01/28 - 01/31',
    phone: '+81 267-xx-xxxx'
  }
];

export const ITINERARY: DayPlan[] = [
  {
    date: '2026-01-24',
    dayOfWeek: '週五',
    title: '啟程：抵達東京羽田',
    weather: { temp: '2°/8°', condition: '晴時多雲', icon: 'sun' },
    events: [
      { id: 'd1-1', time: '16:25', activity: '臺北松山機場 (CI221)', location: 'Taipei Songshan Airport', type: 'transport' },
      { id: 'd1-2', time: '22:15', activity: '抵達羽田機場 (HND)', location: 'Haneda Airport', type: 'transport' },
      { id: 'd1-3', time: '23:00', activity: '入住京急蒲田', location: 'Keikyu Kamata Station', type: 'hotel', highlights: [{type: 'tips', text: '機場直達京急蒲田約10分鐘'}] }
    ]
  },
  {
    date: '2026-01-25',
    dayOfWeek: '週六',
    title: '橫濱巡禮：麵包超人與紅磚倉庫',
    weather: { temp: '3°/7°', condition: '寒冷', icon: 'sun' },
    events: [
      { id: 'd2-1', time: '08:30', activity: '京急蒲田出發', location: 'Keikyu Kamata Station', type: 'transport' },
      { id: 'd2-2', time: '09:30', activity: '橫濱麵包超人兒童博物館', location: 'Yokohama Anpanman Children\'s Museum', type: 'sightseeing', highlights: [{type: 'tips', text: '建議事先購買預售票'}] },
      { id: 'd2-3', time: '11:36', activity: '京急博物館', location: 'Keikyu Museum', type: 'sightseeing' },
      { id: 'd2-4', time: '12:21', activity: '午餐：阿夫利 (AFURI)', location: 'AFURI Yokohama Joinus', type: 'meal', highlights: [{type: 'food', text: '柚子鹽拉麵'}, {type: 'menu', text: '柚子露沾麵'}] },
      { id: 'd2-5', time: '14:22', activity: '橫濱 COSMOWORLD', location: 'Yokohama Cosmo World', type: 'sightseeing', highlights: [{type: 'tips', text: '彩色大摩天輪地標'}] },
      { id: 'd2-6', time: '16:00', activity: '橫濱紅磚倉庫 2號館', location: 'Yokohama Red Brick Warehouse', type: 'shopping', highlights: [{type: 'souvenir', text: '紅磚倉庫限定巧克力'}] },
      { id: 'd2-7', time: '17:02', activity: '下午茶：bills', location: 'bills Yokohama Red Brick Warehouse', type: 'meal', highlights: [{type: 'menu', text: '香蕉蜂蜜奶油鬆餅'}] },
      { id: 'd2-8', time: '18:13', activity: '晚餐：鮪魚問屋 三浦三崎港', location: 'Maguro Tonya World Porters', type: 'meal', highlights: [{type: 'food', text: '三浦半島直送鮪魚'}] },
      { id: 'd2-9', time: '20:01', activity: '橫濱空中纜車 (YOKOHAMA AIR CABIN)', location: 'YOKOHAMA AIR CABIN Sakuragicho', type: 'transport', highlights: [{type: 'tips', text: '享受港未來夜景'}] },
      { id: 'd2-10', time: '20:27', activity: '返回京急蒲田', location: 'Keikyu Kamata Station', type: 'transport' }
    ]
  },
  {
    date: '2026-01-26',
    dayOfWeek: '週一',
    title: '歡樂全日：讀賣樂園',
    weather: { temp: '1°/6°', condition: '多雲', icon: 'cloud' },
    events: [
      { id: 'd3-1', time: '08:43', activity: '抵達京王讀賣樂園', location: 'Keio-Yomiuriland Station', type: 'transport' },
      { id: 'd3-2', time: '08:46', activity: '讀賣樂園 (含纜車體驗)', location: 'Yomiuriland', type: 'sightseeing', highlights: [{type: 'tips', text: '晚上Jewellumination點燈必看'}] },
      { id: 'd3-3', time: '19:01', activity: '晚餐：Wing Kitchen', location: 'Wing Kitchen Keikyu Kamata', type: 'meal' }
    ]
  },
  {
    date: '2026-01-27',
    dayOfWeek: '週二',
    title: '光影藝術與台場巡禮',
    weather: { temp: '2°/8°', condition: '晴天', icon: 'sun' },
    events: [
      { id: 'd4-1', time: '09:30', activity: 'teamLab Planets TOKYO', location: 'teamLab Planets TOKYO', type: 'sightseeing', bookingCode: 'TL-889900', highlights: [{type: 'tips', text: '需赤腳進入，建議著短褲'}] },
      { id: 'd4-2', time: '12:13', activity: '午餐：Lalaport 豐洲', location: 'Urban Dock LaLaport Toyosu', type: 'meal' },
      { id: 'd4-3', time: '13:47', activity: '台場自由女神像', location: 'Statue of Liberty Odaiba', type: 'sightseeing' },
      { id: 'd4-4', time: '14:30', activity: 'AQUA CiTY 台場', location: 'AQUA CiTY ODAIBA', type: 'shopping' },
      { id: 'd4-5', time: '15:41', activity: '哆啦A夢未來百貨公司', location: 'Doraemon Future Department Store', type: 'shopping', highlights: [{type: 'souvenir', text: '限定版竹蜻蜓頭飾'}] },
      { id: 'd4-6', time: '16:45', activity: '獨角獸鋼彈展示', location: 'DiverCity Tokyo Plaza', type: 'sightseeing', highlights: [{type: 'tips', text: '每整點有變身演出'}] },
      { id: 'd4-7', time: '17:55', activity: '晚餐：Sizzler', location: 'Sizzler Aqua City Odaiba', type: 'meal', highlights: [{type: 'menu', text: '起司吐司 (無限量供應)'}] }
    ]
  },
  {
    date: '2026-01-28',
    dayOfWeek: '週三',
    title: '移師輕井澤：雪國開端',
    weather: { temp: '-5°/2°', condition: '降雪機率高', icon: 'snow' },
    events: [
      { id: 'd5-1', time: '09:32', activity: '東京車站集合', location: 'Tokyo Station', type: 'transport' },
      { id: 'd5-2', time: '10:32', activity: '新幹線抵達輕井澤', location: 'Karuizawa Station', type: 'transport', bookingCode: 'JR-EAST-9988' },
      { id: 'd5-3', time: '10:44', activity: 'Grand Vert Check-in', location: 'Hotel Grand Vert Kyu Karuizawa', type: 'hotel' },
      { id: 'd5-4', time: '11:26', activity: '石之教會', location: 'Stone Church Karuizawa', type: 'sightseeing' },
      { id: 'd5-5', time: '12:01', activity: '輕井澤高原教會', location: 'Karuizawa Kogen Church', type: 'sightseeing' },
      { id: 'd5-6', time: '12:39', activity: '午餐：村民食堂', location: 'Sonmin-Shokudo', type: 'meal', highlights: [{type: 'food', text: '信州味噌火鍋'}] },
      { id: 'd5-7', time: '13:44', activity: '榆樹街小鎮', location: 'Harunire Terrace', type: 'shopping', highlights: [{type: 'souvenir', text: '丸山咖啡豆'}] },
      { id: 'd5-8', time: '14:50', activity: '星野溫泉 蜻蜓之湯', location: 'Hoshino Onsen Tombo-no-yu', type: 'sightseeing', highlights: [{type: 'tips', text: '體驗雪地露天風呂'}] },
      { id: 'd5-9', time: '17:53', activity: '輕井澤王子購物廣場', location: 'Karuizawa Prince Shopping Plaza', type: 'shopping' }
    ]
  },
  {
    date: '2026-01-29',
    dayOfWeek: '週四',
    title: '滑雪挑戰：貓熊課',
    weather: { temp: '-6°/0°', condition: '大雪', icon: 'snow' },
    events: [
      { id: 'd6-1', time: '10:00', activity: '貓熊滑雪課程報到', location: 'Karuizawa Prince Hotel Snow Resort', type: 'sightseeing', bookingCode: 'SKI-PANDA-2026' },
      { id: 'd6-2', time: '12:30', activity: '王子購物廣場午餐', location: 'Karuizawa Prince Shopping Plaza', type: 'meal' },
      { id: 'd6-3', time: '14:44', activity: 'Snow Kid\'s Park 雪地遊樂', location: 'Snow Kid\'s Park Karuizawa', type: 'sightseeing' },
      { id: 'd6-4', time: '16:34', activity: '晚餐：燒肉 Fuku-chan', location: 'Yakiniku Fuku-chan Karuizawa', type: 'meal', highlights: [{type: 'food', text: '信州和牛'}, {type: 'menu', text: '厚切牛舌'}] }
    ]
  },
  {
    date: '2026-01-30',
    dayOfWeek: '週五',
    title: '漫步舊輕井澤',
    weather: { temp: '-3°/3°', condition: '晴時多雲', icon: 'cloud' },
    events: [
      { id: 'd7-1', time: '09:16', activity: '雲場池賞景', location: 'Kumoba Pond', type: 'sightseeing' },
      { id: 'd7-2', time: '11:34', activity: '午餐：川上庵蕎麥麵', location: 'Kawakami An Karuizawa', type: 'meal', highlights: [{type: 'food', text: '炸蝦天婦羅蕎麥麵'}] },
      { id: 'd7-3', time: '12:40', activity: '舊輕井澤銀座通', location: 'Kyu-Karuizawa Ginza Dori', type: 'shopping', highlights: [{type: 'souvenir', text: '澤屋 SAWAYA 果醬'}] },
      { id: 'd7-4', time: '13:44', activity: '輕井澤錯視美術館', location: 'Karuizawa Trick Art Museum', type: 'sightseeing' },
      { id: 'd7-5', time: '15:14', activity: '最後採買：王子購物廣場', location: 'Karuizawa Prince Shopping Plaza', type: 'shopping' },
      { id: 'd7-6', time: '17:45', activity: '晚餐：Kastanie Rotiserrie', location: 'Kastanie Rotiserrie Karuizawa', type: 'meal', highlights: [{type: 'food', text: '招牌旋轉烤雞'}] }
    ]
  },
  {
    date: '2026-01-31',
    dayOfWeek: '週六',
    title: '歸途：松山機場',
    weather: { temp: '15°/22°', condition: '台北溫暖', icon: 'sun' },
    events: [
      { id: 'd8-1', time: '09:19', activity: '輕井澤站出發', location: 'Karuizawa Station', type: 'transport' },
      { id: 'd8-2', time: '10:36', activity: '抵達東京車站', location: 'Tokyo Station', type: 'transport' },
      { id: 'd8-3', time: '11:15', activity: '羽田機場 (HND) 報到', location: 'Haneda Airport', type: 'transport', bookingCode: 'RET-ABC-789' },
      { id: 'd8-4', time: '17:15', activity: '返抵臺北松山機場 (TSA)', location: 'Taipei Songshan Airport', type: 'transport' }
    ]
  }
];
