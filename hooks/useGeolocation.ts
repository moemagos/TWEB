
import { useState, useCallback } from 'react';
import { Location } from '../types';

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ location: null, loading: false, error: "La geolocalizzazione non è supportata da questo browser." });
      return;
    }

    setState({ location: null, loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "Impossibile ottenere la posizione.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "L'utente ha negato la richiesta di geolocalizzazione.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Le informazioni sulla posizione non sono disponibili.";
            break;
          case error.TIMEOUT:
            errorMessage = "La richiesta di geolocalizzazione è scaduta.";
            break;
        }
        setState({ location: null, loading: false, error: errorMessage });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, getLocation };
};
