
import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import TimesheetScreen from './components/TimesheetScreen';
import DetailScreen from './components/DetailScreen';
import { User, Timbratura, DayGroup } from './types';
import { apiService } from './services/apiService';
import { NavHomeIcon, NavSheetIcon } from './components/Icons';

type View = 'home' | 'timesheet' | 'detail';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayGroup | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate user login on app start
    const fetchUser = async () => {
      try {
        const user = await apiService.login('utente@test.com', 'password');
        setCurrentUser(user);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  const handleSelectDay = (day: DayGroup) => {
    setSelectedDay(day);
    navigateTo('detail');
  };

  const renderContent = () => {
    if (isLoading || !currentUser) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeScreen user={currentUser} />;
      case 'timesheet':
        return <TimesheetScreen userId={currentUser.id} onSelectDay={handleSelectDay} />;
      case 'detail':
        return <DetailScreen day={selectedDay} onBack={() => navigateTo('timesheet')} />;
      default:
        return <HomeScreen user={currentUser} />;
    }
  };
  
  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
        onClick={() => navigateTo(view)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        currentView === view ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
        }`}
    >
        {icon}
        <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-800 flex flex-col">
      <div className="flex-grow container mx-auto max-w-lg p-0">
        <main className="h-[calc(100vh-60px)] overflow-y-auto">
            {renderContent()}
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-slate-200 shadow-t-lg">
        <nav className="flex justify-around h-[60px]">
          <NavItem view="home" label="Home" icon={<NavHomeIcon />} />
          <NavItem view="timesheet" label="Cartellino" icon={<NavSheetIcon />} />
        </nav>
      </footer>
    </div>
  );
};

export default App;
