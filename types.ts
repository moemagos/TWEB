
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Timbratura {
  id: number;
  userId: number;
  type: 'in' | 'out';
  timestamp: string;
  location: Location;
}

export interface DayGroup {
  date: string;
  entry: Timbratura | null;
  exit: Timbratura | null;
  totalHours: string | null;
}
