import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlayGame from './pages/PlayGame';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfileModal from './components/UserProfileModal';
import OnboardingProfileModal from './components/OnboardingProfileModal';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [activeProfileUsername, setActiveProfileUsername] = useState(null);
  const { isAuthenticated, isProfileIncomplete } = useAuth();

  const renderView = () => {
    // Route guard: redirect to login if trying to play or access profile without being authenticated
    if ((currentView === 'play' || currentView === 'profile') && !isAuthenticated) {
      return <Login setCurrentView={setCurrentView} />;
    }

    switch (currentView) {
      case 'landing':
        return <Home setCurrentView={setCurrentView} setSelectedGameId={setSelectedGameId} onViewProfile={setActiveProfileUsername} />;
      case 'play':
        return <PlayGame gameId={selectedGameId} setCurrentView={setCurrentView} />;
      case 'leaderboard':
        return <Leaderboard onViewProfile={setActiveProfileUsername} />;
      case 'login':
        return <Login setCurrentView={setCurrentView} />;
      case 'profile':
        return <Profile setCurrentView={setCurrentView} />;
      default:
        return <Home setCurrentView={setCurrentView} setSelectedGameId={setSelectedGameId} onViewProfile={setActiveProfileUsername} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} onViewProfile={setActiveProfileUsername} />
      
      <main className="flex-1 max-w-6xl w-full mx-auto pb-10 px-4">
        {renderView()}
      </main>

      {/* Render the user profile viewer modal when active */}
      {activeProfileUsername && (
        <UserProfileModal 
          username={activeProfileUsername} 
          onClose={() => setActiveProfileUsername(null)} 
        />
      )}

      {/* Render the onboarding modal automatically for new Google OAuth users with incomplete profiles */}
      {isAuthenticated && isProfileIncomplete && (
        <OnboardingProfileModal />
      )}

      <footer className="mt-auto py-8 border-t-[3px] border-zinc-950 bg-white text-zinc-650 shadow-[0_-4px_0px_0px_rgba(12,10,9,1)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium">
          {/* Brand Logo styled exactly like Navbar logo */}
          <div 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 cursor-pointer font-heading font-black text-lg select-none tracking-tight text-zinc-950 border-[2.5px] border-zinc-950 bg-amber-400 px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(12,10,9,1)] transition-all duration-150 rounded-md"
          >
            <svg 
              className="w-5 h-5 text-zinc-950" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2c-3.8 0-7 3.2-7 7 0 2.8 1.8 5 4.5 6.2.8.3 1.5.8 1.5 1.8v1.5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V17c0-1 .7-1.5 1.5-1.8 2.7-1.2 4.5-3.4 4.5-6.2 0-3.8-3.2-7-7-7z" />
              <path d="M9 22h6" />
            </svg>
            <span>NUSA-<span className="text-zinc-950 font-black decoration-wavy underline decoration-zinc-950 underline-offset-4">BENCH</span></span>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} NUSA-BENCH. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
