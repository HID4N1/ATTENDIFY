import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCountdown } from '../hooks/useCountdown';

interface CountdownContextType {
  timeLeft: number;
  isActive: boolean;
  sessionId: string | null;
  startCountdown: (duration: number, sessionId: string) => void;
  stopCountdown: () => void;
  addTime: (minutes: number) => void;
  setTime: (minutes: number) => void;
  setSessionId: (id: string | null) => void;
}

const CountdownContext = createContext<CountdownContextType | undefined>(undefined);

export const useCountdownContext = () => {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error('useCountdownContext must be used within a CountdownProvider');
  }
  return context;
};

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownProvider: React.FC<CountdownProviderProps> = ({ children }) => {
  const { timeLeft, isActive, start, stop, addTime, setTime } = useCountdown();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startCountdown = (duration: number, id: string) => {
    setSessionId(id);
    start(duration);
  };

  const stopCountdown = () => {
    stop();
    setSessionId(null);
  };

  const value: CountdownContextType = {
    timeLeft,
    isActive,
    sessionId,
    startCountdown,
    stopCountdown,
    addTime,
    setTime,
    setSessionId,
  };

  return (
    <CountdownContext.Provider value={value}>
      {children}
    </CountdownContext.Provider>
  );
};
