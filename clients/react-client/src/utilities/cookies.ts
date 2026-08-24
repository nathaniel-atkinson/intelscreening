const booleanCookies = ["footer", "header", "leftAside", "rightAside"];

function init() {
  booleanCookies.forEach((name) => {
    const value = get(name);

    if (value === undefined) {
      document.cookie = `${name}=true; path=/`;
    }
  });
}

function set(name: string, value: boolean) {
  document.cookie = `${name}=${value}; path=/`;
}

function get(name: string): boolean | null {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((row) => row.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  const value = decodeURIComponent(cookie.substring(name.length + 1));

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
}

function toggle(name: string) {
  const current = get(name);

  if (current === null) {
    set(name, true);
    return true;
  }

  const newValue = !current;
  set(name, newValue);

  return newValue;
}

export default { init, set, get, toggle };
