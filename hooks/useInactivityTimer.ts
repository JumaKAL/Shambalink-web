
import { useEffect, useCallback } from 'react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useInactivityTimer = (onIdle: () => void) => {
  const resetTimer = useCallback(() => {
    window.clearTimeout(window.inactivityTimer);
    window.inactivityTimer = window.setTimeout(onIdle, INACTIVITY_TIMEOUT);
  }, [onIdle]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    
    const eventHandler = () => {
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, eventHandler));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, eventHandler));
      window.clearTimeout(window.inactivityTimer);
    };
  }, [resetTimer]);

  return { resetTimer };
};

// Extend the Window interface to include our timer ID
declare global {
  interface Window {
    inactivityTimer: number;
  }
}
