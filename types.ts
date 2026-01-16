
export interface TripHighlight {
  type: 'food' | 'menu' | 'souvenir' | 'tips';
  text: string;
}

export interface TripEvent {
  id: string;
  time: string;
  activity: string;
  location: string;
  locationAddress?: string;
  type: 'transport' | 'meal' | 'sightseeing' | 'hotel' | 'shopping';
  description?: string;
  transportMode?: string;
  highlights?: TripHighlight[];
  bookingCode?: string;
}

export interface DayWeather {
  temp: string;
  condition: string;
  icon: 'sun' | 'cloud' | 'snow' | 'rain';
}

export interface DayPlan {
  date: string;
  dayOfWeek: string;
  title: string;
  events: TripEvent[];
  backupPlans?: string[];
  weather?: DayWeather;
}

export interface Expense {
  id: string;
  category: string;
  item: string;
  amount: number;
}
