type CookieValue = string | number | boolean;

const defaultCookies = {
  cookiepermanence: true,
  footer: true,
  header: true,
  asides: true,
  leftAside: true,
  rightAside: true,
} as const;

export type BooleanCookie = keyof typeof defaultCookies;

type CookieListener = () => void;

class CookiesManager {
  private registry = new Map<string, CookieValue>();

  private listeners = new Map<string, Set<CookieListener>>();

  constructor() {
    Object.entries(defaultCookies).forEach(([name, value]) => {
      this.registry.set(name, value);
    });
  }

  // -------------------------
  // Registration
  // -------------------------

  register<T extends CookieValue>(name: string, defaultValue: T): void {
    if (!this.registry.has(name)) {
      this.registry.set(name, defaultValue);
    }

    if (this.get(name) === null) {
      this.set(name, defaultValue);
    }
  }

  // -------------------------
  // Initialization
  // -------------------------

  init(): void {
    // Initialize permanence first.
    if (this.get("cookiepermanence") === null) {
      this.set("cookiepermanence", true);
    }

    this.registry.forEach((defaultValue, name) => {
      if (name === "cookiepermanence") return;

      if (this.get(name) === null) {
        this.set(name, defaultValue);
      }
    });
  }

  // -------------------------
  // Reading
  // -------------------------

  get<T extends CookieValue = CookieValue>(name: string): T | null {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));

    if (!cookie) return null;

    const raw = decodeURIComponent(cookie.substring(cookie.indexOf("=") + 1));

    const defaultValue = this.registry.get(name);

    if (defaultValue === undefined) return null;

    switch (typeof defaultValue) {
      case "boolean":
        if (raw === "true") return true as T;
        if (raw === "false") return false as T;
        return null;

      case "number": {
        if (raw.trim() === "") return null;

        const number = Number(raw);

        return Number.isFinite(number) ? (number as T) : null;
      }

      case "string":
        return raw as T;

      default:
        return null;
    }
  }

  // -------------------------
  // Writing
  // -------------------------

  set<T extends CookieValue>(name: string, value: T): void {
    const registered = this.registry.get(name);

    if (registered === undefined) {
      throw new Error(`Cookie "${name}" has not been registered.`);
    }

    if (typeof registered !== typeof value) {
      throw new TypeError(`Cookie "${name}" requires a ${typeof registered}.`);
    }

    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new TypeError(`Cookie "${name}" requires a finite number.`);
    }

    const previous = this.get(name);

    const persistent =
      name === "cookiepermanence"
        ? value === true
        : (this.get<boolean>("cookiepermanence") ?? true);

    this.write(name, value, persistent);

    if (previous !== value) {
      this.notify(name);
    }

    // Rewrite existing registered cookies whenever
    // the permanence preference changes.
    if (name === "cookiepermanence" && previous !== value) {
      this.registry.forEach((defaultValue, cookieName) => {
        if (cookieName === "cookiepermanence") return;

        const current = this.get(cookieName);

        if (current !== null) {
          this.write(cookieName, current, persistent);
        }
      });
    }
  }

  private write(name: string, value: CookieValue, persistent: boolean): void {
    const encodedName = encodeURIComponent(name);
    const encodedValue = encodeURIComponent(String(value));

    document.cookie = [
      `${encodedName}=${encodedValue}`,
      "path=/",
      "SameSite=Lax",
      ...(persistent ? ["max-age=31536000"] : []),
    ].join("; ");
  }

  // -------------------------
  // Toggling
  // -------------------------

  toggle(name: string): boolean {
    const defaultValue = this.registry.get(name);

    if (typeof defaultValue !== "boolean") {
      throw new TypeError(`Cookie "${name}" is not a boolean.`);
    }

    const current = this.get<boolean>(name) ?? defaultValue;

    const next = !current;

    this.set(name, next);

    return next;
  }

  // -------------------------
  // Subscriptions
  // -------------------------

  subscribe(name: string, listener: CookieListener): () => void {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }

    this.listeners.get(name)!.add(listener);

    return () => {
      const subscribers = this.listeners.get(name);

      subscribers?.delete(listener);

      if (subscribers?.size === 0) {
        this.listeners.delete(name);
      }
    };
  }

  private notify(name: string): void {
    this.listeners.get(name)?.forEach((listener) => {
      listener();
    });
  }

  // -------------------------
  // Data
  // -------------------------

  data(): Record<string, CookieValue> {
    const result: Record<string, CookieValue> = {};

    this.registry.forEach((defaultValue, name) => {
      result[name] = this.get(name) ?? defaultValue;
    });

    return result;
  }

  // -------------------------
  // Removal
  // -------------------------

  remove(name: string): void {
    if (!this.registry.has(name)) return;

    const previous = this.get(name);

    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;

    if (previous !== null) {
      this.notify(name);
    }
  }

  // -------------------------
  // Defaults
  // -------------------------

  default<T extends CookieValue = CookieValue>(name: string): T | null {
    return (this.registry.get(name) as T | undefined) ?? null;
  }
}

const cookiesManager = new CookiesManager();

export default function Cookies(): CookiesManager {
  return cookiesManager;
}
