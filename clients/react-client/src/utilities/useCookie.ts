import { useCallback, useSyncExternalStore } from "react";
import Cookies from "./cookies.js";

type CookieValue = string | number | boolean;

const cookies = Cookies();

export default function useCookie<T extends CookieValue>(
  name: string,
  defaultValue: T,
) {
  // Register before reading or subscribing.
  cookies.register(name, defaultValue);

  const subscribe = useCallback(
    (listener: () => void) => cookies.subscribe(name, listener),
    [name],
  );

  const getSnapshot = useCallback(
    () => cookies.get<T>(name) ?? defaultValue,
    [name, defaultValue],
  );

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => defaultValue,
  );

  const set = useCallback((next: T) => cookies.set(name, next), [name]);

  const toggle = useCallback(() => {
    return cookies.toggle(name);
  }, [name]);

  return {
    value,
    set,
    toggle,
  };
}
