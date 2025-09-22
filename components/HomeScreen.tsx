
import React, { useState, useEffect, useCallback } from 'react';
import { User, Timbratura } from '../types';
import { apiService } from '../services/apiService';
import { useGeolocation } from '../hooks/useGeolocation';
import { ClockIcon } from './Icons';

interface HomeScreenProps {
  user: User;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const [lastTimbratura, setLastTimbratura] = useState<Timbratura | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { location, loading: geoLoading, error: geoError, getLocation } = useGeolocation();

  const fetchLastTimbratura = useCallback(async () => {
    setIsLoading(true);
    const last = await apiService.getLastTimbratura(user.id);
    setLastTimbratura(last);
    setIsLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchLastTimbratura();
  }, [fetchLastTimbratura]);

  useEffect(() => {
    if (location && isProcessing) {
      const clockType = lastTimbratura?.type === 'in' ? 'out' : 'in';
      apiService.createTimbratura(user.id, clockType, location)
        .then(() => {
          fetchLastTimbratura();
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isProcessing, user.id]);

  const handleClockAction = () => {
    setIsProcessing(true);
    getLocation();
  };
  
  const isInService = lastTimbratura?.type === 'in';
  const buttonText = isInService ? 'TIMBRA USCITA' : 'TIMBRA ENTRATA';
  const buttonColor = isInService ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';
  const statusColor = isInService ? 'text-green-600' : 'text-red-600';
  const statusText = isInService ? 'In servizio' : 'Non in servizio';
  const loading = isLoading || isProcessing || geoLoading;

  const getFormattedTime = (timestamp: string | undefined) => {
      if (!timestamp) return 'N/A';
      return new Date(timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex flex-col items-center justify-between p-6 h-full bg-slate-50">
        <header className="w-full text-center">
            <h1 className="text-2xl font-bold text-slate-800">Ciao, {user.name}</h1>
            <p className="text-slate-500">Benvenuto in GeoTimbra</p>
        </header>

        <div className="flex flex-col items-center justify-center flex-grow">
            <div className="text-center mb-8">
                <p className="text-lg text-slate-600">Stato attuale:</p>
                <p className={`text-4xl font-bold ${statusColor}`}>{statusText}</p>
                {lastTimbratura && (
                    <p className="text-sm text-slate-500 mt-2">
                        Ultima timbratura: {lastTimbratura.type === 'in' ? 'Entrata' : 'Uscita'} alle {getFormattedTime(lastTimbratura.timestamp)}
                    </p>
                )}
            </div>

            <button
                onClick={handleClockAction}
                disabled={loading}
                className={`relative w-48 h-48 rounded-full text-white text-xl font-bold shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${buttonColor} ${isInService ? 'focus:ring-red-400' : 'focus:ring-green-400'} flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                ) : (
                    <div className="flex flex-col items-center">
                        <ClockIcon />
                        <span className="mt-2">{buttonText}</span>
                    </div>
                )}
            </button>
            {geoError && <p className="text-red-500 mt-4 text-center">{geoError}</p>}
        </div>

        <div className="h-10"></div>
    </div>
  );
};

export default HomeScreen;
