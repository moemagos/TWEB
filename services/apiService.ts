
import { User, Timbratura, Location } from '../types';

// Mock database using localStorage
const getMockData = (): Timbratura[] => {
  const data = localStorage.getItem('timbrature');
  if (data) {
    return JSON.parse(data);
  }
  // Initial seed data
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);

  const initialData: Timbratura[] = [
    { id: 1, userId: 1, type: 'in', timestamp: new Date(yesterday.setHours(9, 1, 15)).toISOString(), location: { latitude: 45.4642, longitude: 9.1900 } },
    { id: 2, userId: 1, type: 'out', timestamp: new Date(yesterday.setHours(18, 2, 30)).toISOString(), location: { latitude: 45.4642, longitude: 9.1900 } },
    { id: 3, userId: 1, type: 'in', timestamp: new Date(twoDaysAgo.setHours(8, 55, 10)).toISOString(), location: { latitude: 45.4650, longitude: 9.1910 } },
    { id: 4, userId: 1, type: 'out', timestamp: new Date(twoDaysAgo.setHours(17, 30, 5)).toISOString(), location: { latitude: 45.4655, longitude: 9.1915 } },
  ];
  localStorage.setItem('timbrature', JSON.stringify(initialData));
  return initialData;
};

const saveMockData = (data: Timbratura[]) => {
  localStorage.setItem('timbrature', JSON.stringify(data));
};

const mockUser: User = {
  id: 1,
  name: 'Mario Rossi',
  email: 'utente@test.com'
};

export const apiService = {
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'utente@test.com' && password === 'password') {
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  getTimbrature: (userId: number, month: number, year: number): Promise<Timbratura[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allTimbrature = getMockData();
        const filtered = allTimbrature.filter(t => {
          const d = new Date(t.timestamp);
          return t.userId === userId && d.getMonth() === month && d.getFullYear() === year;
        });
        resolve(filtered);
      }, 500);
    });
  },

  createTimbratura: (userId: number, type: 'in' | 'out', location: Location): Promise<Timbratura> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allTimbrature = getMockData();
        const newTimbratura: Timbratura = {
          id: allTimbrature.length + 1,
          userId,
          type,
          timestamp: new Date().toISOString(),
          location,
        };
        const updatedTimbrature = [...allTimbrature, newTimbratura];
        saveMockData(updatedTimbrature);
        resolve(newTimbratura);
      }, 500);
    });
  },

  getLastTimbratura: (userId: number): Promise<Timbratura | null> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const allTimbrature = getMockData();
              const userTimbrature = allTimbrature
                  .filter(t => t.userId === userId)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              resolve(userTimbrature.length > 0 ? userTimbrature[0] : null);
          }, 300);
      });
  }
};
