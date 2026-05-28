import { useState, useCallback, useEffect, useRef } from 'react';
import { useApp } from './context/AppContext.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Sheet from './components/Sheet.jsx';
import TendencyModal from './components/TendencyModal.jsx';
import WelcomeModal from './components/WelcomeModal.jsx';
import TourTooltip from './components/TourTooltip.jsx';
import HomePage from './pages/HomePage.jsx';
import PrescriptionPage from './pages/PrescriptionPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.out ? ' out' : ''}`}>{t.msg}</div>
      ))}
    </div>
  );
}

export default function App() {
  const { user, activeSheet, setActiveSheet, setRxLeader } = useApp();
  const [tab, setTab] = useState('home');
  const [toasts, setToasts] = useState([]);
  const [showTendency, setShowTendency] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const prevUser = useRef(null);

  useEffect(() => {
    if (!prevUser.current && user) {
      setShowWelcome(true);
    }
    prevUser.current = user;
  }, [user]);

  const showToast = useCallback((msg, duration = 2200) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, out: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, out: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 280);
    }, duration);
  }, []);

  const handleGoToRx = useCallback((leader) => {
    setRxLeader(leader);
    setActiveSheet(null);
    setTab('rx');
  }, [setRxLeader, setActiveSheet]);

  if (!user) return <LoginScreen />;

  return (
    <div className="app-layout">
      <Header />

      <main className="page">
        {tab === 'home' && <HomePage showToast={showToast} />}
        {tab === 'rx' && <PrescriptionPage showToast={showToast} />}
        {tab === 'stats' && <StatsPage />}
        {tab === 'profile' && <ProfilePage showToast={showToast} setTab={setTab} onTendency={() => setShowTendency(true)} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />

      {activeSheet && (
        <Sheet
          leader={activeSheet}
          onClose={() => setActiveSheet(null)}
          onGoToRx={handleGoToRx}
          showToast={showToast}
        />
      )}

      {showWelcome && <WelcomeModal onClose={() => { setShowWelcome(false); setShowTour(true); }} />}
      {showTour && <TourTooltip onDone={() => setShowTour(false)} />}
      {showTendency && <TendencyModal onClose={() => setShowTendency(false)} />}

      <Toast toasts={toasts} />
    </div>
  );
}
