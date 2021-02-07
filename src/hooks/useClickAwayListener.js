import { useEffect } from 'react';

const EVENT = 'mousedown';
export default function useClickAwayListener(ref, callback) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref || !ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };
    document.addEventListener(EVENT, listener);
    return () => {
      document.removeEventListener(EVENT, listener);
    };
  }, [ref, callback]);
}
