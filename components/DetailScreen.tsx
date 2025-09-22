
import React from 'react';
import { DayGroup } from '../types';
import { BackArrowIcon, MapPinIcon } from './Icons';

interface DetailScreenProps {
  day: DayGroup | null;
  onBack: () => void;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ day, onBack }) => {
  if (!day) {
    return (
      <div className="p-4">
        <p>Nessun dato selezionato.</p>
        <button onClick={onBack} className="text-blue-600">Torna indietro</button>
      </div>
    );
  }

  const getFormattedDateTime = (timestamp: string | undefined | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'medium' });
  }
  
  const getFormattedTime = (timestamp: string | undefined | null) => {
    if (!timestamp) return '--:--:--';
    return new Date(timestamp).toLocaleTimeString('it-IT', { timeStyle: 'medium' });
  }

  const mapLink = (lat: number, lon: number) => `https://www.google.com/maps?q=${lat},${lon}`;
  
  const DetailCard: React.FC<{ title: string; timbratura: DayGroup['entry'] | DayGroup['exit']; color: string }> = ({ title, timbratura, color }) => (
    <div className="bg-white rounded-lg p-5 shadow-md">
        <h3 className={`text-xl font-bold mb-3 ${color}`}>{title}</h3>
        {timbratura ? (
            <div className="space-y-2 text-slate-700">
                <p><strong>Orario:</strong> {getFormattedTime(timbratura.timestamp)}</p>
                <p><strong>Posizione:</strong> {timbratura.location.latitude.toFixed(4)}, {timbratura.location.longitude.toFixed(4)}</p>
                <a 
                    href={mapLink(timbratura.location.latitude, timbratura.location.longitude)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                    <MapPinIcon />
                    <span className="ml-2">Mostra su Mappa</span>
                </a>
            </div>
        ) : (
            <p className="text-slate-500">Dato non disponibile.</p>
        )}
    </div>
  );

  return (
    <div className="p-4 bg-slate-100 min-h-full">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
          <BackArrowIcon />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Dettaglio Giornata</h1>
            <p className="text-slate-500">{new Date(day.entry?.timestamp || day.exit?.timestamp || '').toLocaleDateString('it-IT', { dateStyle: 'full' })}</p>
        </div>
      </header>

      <div className="space-y-4">
        <DetailCard title="Timbratura di Entrata" timbratura={day.entry} color="text-green-600" />
        <DetailCard title="Timbratura di Uscita" timbratura={day.exit} color="text-red-600" />
      </div>

    </div>
  );
};

export default DetailScreen;
