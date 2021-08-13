import { useEffect, RefObject } from 'react';

const EVENT = 'mousedown';

export function useAwayListener(
  ref: RefObject<HTMLElement>,
  callback: (arg0: Event) => void,
  eventName: string = EVENT,
) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref || !ref.current || ref.current.contains(event.target as Node))
        return;
      callback(event);
    };
    document.addEventListener(eventName, listener);
    return () => {
      document.removeEventListener(eventName, listener);
    };
  }, [ref, callback]);
}
