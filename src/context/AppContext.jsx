import { createContext, useContext, useState, useCallback } from 'react';
import { TRANSLATIONS } from '../data/translations';

const AppContext = createContext(null);

const LS = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

export function AppProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('gp_lang') || 'ko');
  const [user, setUser] = useState(() => LS.get('gp_user'));
  const [evals, setEvals] = useState(() => LS.get('gp_evals', {}));
  const [rxMap, setRxMap] = useState(() => LS.get('gp_rx_map', {}));
  const [activeSheet, setActiveSheet] = useState(null);
  const [rxLeader, setRxLeader] = useState(null);

  const t = (key) => {
    const tr = TRANSLATIONS[lang] || TRANSLATIONS.ko;
    return tr[key] ?? (TRANSLATIONS.ko[key] ?? key);
  };
  const tName = (id) => (TRANSLATIONS[lang]?.names?.[id]) ?? (TRANSLATIONS.ko.names[id] ?? id);
  const tTitle = (id) => (TRANSLATIONS[lang]?.titles?.[id]) ?? (TRANSLATIONS.ko.titles[id] ?? id);

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem('gp_lang', l);
  }, []);

  const login = useCallback((name) => {
    const u = { name, initial: [...name][0] || '?', ts: Date.now() };
    setUser(u);
    LS.set('gp_user', u);
  }, []);

  const logout = useCallback(() => {
    LS.remove('gp_user');
    setUser(null);
  }, []);

  const saveEval = useCallback((id, peace, tension) => {
    const next = { ...evals, [id]: { peace, tension, ts: Date.now() } };
    setEvals(next);
    LS.set('gp_evals', next);
  }, [evals]);

  const getEval = useCallback((id) => evals[id] ?? null, [evals]);

  const saveRx = useCallback((id, data) => {
    const next = { ...rxMap, [id]: { ...data, ts: Date.now() } };
    setRxMap(next);
    LS.set('gp_rx_map', next);
  }, [rxMap]);

  const getRx = useCallback((id) => rxMap[id] ?? null, [rxMap]);

  const clearAll = useCallback(() => {
    setEvals({});
    setRxMap({});
    LS.remove('gp_evals');
    LS.remove('gp_rx_map');
  }, []);

  return (
    <AppContext.Provider value={{
      lang, setLang, t, tName, tTitle,
      user, login, logout,
      evals, saveEval, getEval,
      rxMap, saveRx, getRx,
      clearAll,
      activeSheet, setActiveSheet,
      rxLeader, setRxLeader,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
