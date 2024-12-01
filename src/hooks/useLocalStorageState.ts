import { Dispatch, useEffect, useState } from 'preact/compat';
import { StateUpdater } from 'preact/hooks';

export function useLocalStorageState<TValue>(
  defaultValue: TValue,
  localStorageKey: string,
): [TValue, Dispatch<StateUpdater<TValue>>] {
  const [value, setValue] = useState<TValue>(() => {
    const itemValue = localStorage.getItem(localStorageKey);
    if (itemValue === null || itemValue === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(itemValue);
    } catch (e) {
      console.warn('Parse info in local storage error', e);
      return defaultValue;
    }
  });
  useEffect(() => {
    if (!value) {
      return;
    }
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
