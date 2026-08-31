const booleanCookies = ["footer", "header", "leftAside", "rightAside"] as const;

type BooleanCookie = (typeof booleanCookies)[number];

class CookiesManager {
  private listeners = new Map<BooleanCookie, Set<(value: boolean) => void>>();

  init() {
    booleanCookies.forEach((name) => {
      if (this.get(name) === null) {
        this.set(name, true);
      }
    });
  }

  data(): Record<BooleanCookie, boolean> {
    return Object.fromEntries(
      booleanCookies.map((name) => [name, this.get(name) ?? true]),
    ) as Record<BooleanCookie, boolean>;
  }

  get(name: BooleanCookie): boolean | null {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));

    if (!cookie) {
      return null;
    }

    const value = decodeURIComponent(cookie.substring(name.length + 1));

    if (value === "true") return true;
    if (value === "false") return false;

    return null;
  }

  set(name: BooleanCookie, value: boolean) {
    document.cookie = `${name}=${value}; path=/`;

    this.listeners.get(name)?.forEach((listener) => {
      listener(value);
    });
  }

  toggle(name: BooleanCookie) {
    const newValue = !(this.get(name) ?? true);

    this.set(name, newValue);

    return newValue;
  }

  subscribe(name: BooleanCookie, listener: (value: boolean) => void) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }

    this.listeners.get(name)!.add(listener);

    return () => {
      this.listeners.get(name)?.delete(listener);
    };
  }
}

export default function Cookies() {
  const manager = new CookiesManager();
  manager.init();
  return manager;
}
