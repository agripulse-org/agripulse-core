import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/lib/utils";

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

export function useDebouncedSearch(
  initialValue: string = "",
  options: UseDebouncedSearchOptions = {},
) {
  const { delay = 300, minLength = 0 } = options;

  const [inputValue, setInputValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debouncedSetValue = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedValue(value);
        setIsDebouncing(false);
      }, delay),
    [delay],
  );

  useEffect(() => {
    if (inputValue.length >= minLength) {
      setIsDebouncing(true);
      debouncedSetValue(inputValue);
    } else {
      setDebouncedValue("");
      setIsDebouncing(false);
    }

    return () => {
      setIsDebouncing(false);
    };
  }, [inputValue, minLength, debouncedSetValue]);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  return {
    inputValue,
    debouncedValue,
    isDebouncing,
    setInputValue,
    setDebouncedValue,
  };
}
