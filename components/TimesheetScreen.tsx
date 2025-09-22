
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { Timbratura, DayGroup } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from './Icons';

interface TimesheetScreenProps {
  userId: number;
  onSelectDay: (day: DayGroup) => void;
}

const TimesheetScreen: React.FC<TimesheetScreenProps> = ({ userId, onSelectDay }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timbrature, setTimbrature] = useState<Timbratura[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTimbrature = useCallback(async () => {
    setIsLoading(true);
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    try {
      const data = await apiService.getTimbrature(userId, month, year);
      setTimbrature(data);
    } catch (error) {
      console.error("Failed to fetch timbrature:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentDate]);

  useEffect(() => {
    fetchTimbrature();
  }, [fetchTimbrature]);
  
  const groupedByDay = useMemo<DayGroup[]>(() => {
    const groups: { [key: string]: { entry: Timbratura | null, exit: Timbratura | null } } = {};

    const sorted = [...timbrature].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    sorted.forEach(t => {
      const dateKey = new Date(t.timestamp).toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (!groups[dateKey]) {
        groups[dateKey] = { entry: null, exit: null };
      }
      if (t.type === 'in' && !groups[dateKey].entry) {
        groups[dateKey].entry = t;
      } else if (t.type === 'out') {
        groups[dateKey].exit = t;
      }
    });

    return Object.keys(groups).map(dateKey => {
      const { entry, exit } = groups[dateKey];
      let totalHours = null;
      if (entry && exit) {
        const diff = new Date(exit.timestamp).getTime() - new Date(entry.timestamp).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        totalHours = `${hours}h ${minutes}m`;
      }
      return {
        date: dateKey,
        entry,
        exit,
        totalHours,
      };
    }).sort((a,b) => new Date(b.entry?.timestamp || 0).getTime() - new Date(a.entry?.timestamp || 0).getTime());
  }, [timbrature]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const getFormattedTime = (timestamp: string | undefined | null) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="p-4 bg-white min-h-full">
      <header className="flex items-center justify-between mb-6">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ChevronLeftIcon />
        </button>
        <h1 className="text-xl font-bold text-slate-800 text-center">
          {currentDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
        </h1>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ChevronRightIcon />
        </button>
      </header>

      {isLoading ? (
        <div className="text-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Caricamento...</p>
        </div>
      ) : groupedByDay.length > 0 ? (
        <ul className="space-y-3">
          {groupedByDay.map((day) => (
            <li key={day.date} onClick={() => onSelectDay(day)} className="bg-slate-50 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-700">{new Date(day.entry?.timestamp || day.exit?.timestamp || '').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p className="text-sm text-slate-500">
                    Ore totali: <span className="font-semibold text-slate-600">{day.totalHours || 'N/A'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Entrata: {getFormattedTime(day.entry?.timestamp)}</p>
                  <p className="text-sm text-red-600">Uscita: {getFormattedTime(day.exit?.timestamp)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center p-10 rounded-lg bg-slate-100">
            <CalendarIcon />
            <p className="mt-4 text-slate-600 font-semibold">Nessuna timbratura</p>
            <p className="text-sm text-slate-500">Non ci sono dati per il mese selezionato.</p>
        </div>
      )}
    </div>
  );
};

export default TimesheetScreen;
