/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-eval */
import { useEffect, useCallback, useState } from 'react';
import { storage } from '@/utils/index';
import { debounce } from 'lodash'


const debounceStorageSet = <K>() => debounce((key: string, val: K) => storage.set<K>(key, val), 500);

export default function useStorageState<T>(key: string, value: T): [T, ((val: T) => void)] {
  const [iv, setIv] = useState<T>(value);
  const setValue = useCallback((val: T) => {
    setIv(val);
    debounceStorageSet<T>()(`storage_state_${key}`, val);
  }, []);
  useEffect(() => {
    const sv = storage.get<T>(`storage_state_${key}`);
    if (sv) {
      setIv(sv);
    } else {
      setValue(value);
    }
  }, []);
  return [iv, setValue];
}
