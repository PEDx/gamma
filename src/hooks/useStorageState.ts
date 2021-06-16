/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-eval */
import { useEffect, useCallback, useState } from 'react';
import { storage } from '@/utils/index';
import { debounce } from 'lodash';

const debounceStorageSet = debounce(
  <K>(key: string, val: K) => storage.set<K>(key, val),
  500,
);

export function useStorageState<T>(
  key: string,
  value: T,
): [T, (val: T) => void] {

  const sv = storage.get<T>(`storage_state_${key}`);
  const [iv, setIv] = useState<T>(sv ? sv : value);

  const setValue = useCallback((val: T) => {
    setIv(val);
    debounceStorageSet(`storage_state_${key}`, val);
  }, []);

  useEffect(() => {
    if (!sv) setValue(value);
  }, []);
  return [iv, setValue];
}
