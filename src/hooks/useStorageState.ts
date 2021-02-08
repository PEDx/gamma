/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-eval */
import { useEffect, useCallback, useState } from 'react';
import { storage, debounce } from '@/utils/index';

const debounceStorageSet = debounce((key: string, val: any) => storage.set(key, val), 500);

export default function useStorageState<T>(key: string, value: T): [T, ((val: T) => void)] {
  const [iv, setIv] = useState<T>(value);
  const setValue = useCallback((val: T) => {
    setIv(val);
    debounceStorageSet(`storage_state_${key}`, val);
  }, []);
  useEffect(() => {
    const sv = storage.get(`storage_state_${key}`);
    if (sv) {
      setIv(sv);
    } else {
      setValue(value);
    }
  }, []);
  return [iv, setValue];
}
