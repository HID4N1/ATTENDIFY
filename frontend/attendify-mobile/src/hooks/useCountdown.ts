import { useState, useEffect, useRef } from 'react';

interface UseCountdownReturn {
  timeLeft: number;
  isActive: boolean;
  start: (duration: number) => void;
  stop: () => void;
  addTime: (minutes: number) => void;
  setTime: (minutes: number) => void;
}

export const useCountdown = (): UseCountdownReturn => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = (duration: number) => {
    setTimeLeft(duration);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const addTime = (minutes: number) => {
    setTimeLeft(prev => prev + minutes * 60);
  };

  const setTime = (minutes: number) => {
    setTimeLeft(minutes * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  return { timeLeft, isActive, start, stop, addTime, setTime };
};
