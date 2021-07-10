import { useEffect, RefObject } from 'react';

const EVENT = 'mousedown';
export default function useClickAwayListener(ref: RefObject<HTMLElement>, callback: (arg0: Event) => void) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref || !ref.current || ref.current.contains(event.target as Node)) return
      callback(event);
    };
    document.addEventListener(EVENT, listener);
    return () => {
      document.removeEventListener(EVENT, listener);
    };
  }, [ref, callback]);
}
