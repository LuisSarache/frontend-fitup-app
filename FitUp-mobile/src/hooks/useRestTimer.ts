import { useState, useEffect, useRef } from 'react';

export function useRestTimer(defaultSeconds = 60) {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (override?: number) => {
    setSeconds(override ?? defaultSeconds);
    setActive(true);
  };

  const skip = () => {
    setActive(false);
    setSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  const progress = active && seconds > 0 ? seconds / defaultSeconds : 0;

  return { seconds, active, progress, start, skip };
}
