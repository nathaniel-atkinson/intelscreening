import { useEffect, useState } from "react";

import Home from "../pages/home/home";
import Directory from "../pages/directory/directory";
import Settings from "../pages/settings/settings";
import Modal from "../pages/modals/modals";

const pages = {
  home: Home,
  directory: Directory,
  settings: Settings,
  modal: Modal,
} as const;

export type Page = keyof typeof pages;

function getCurrentPage(): Page {
  const params = new URLSearchParams(window.location.search);

  const embed = params.get("embed");

  if (embed && embed in pages) {
    sessionStorage.setItem("page", embed);
    return embed as Page;
  }

  const saved = sessionStorage.getItem("page");

  if (saved && saved in pages) {
    return saved as Page;
  }

  return "home";
}

export function navigate(page: Page, params: Record<string, string> = {}) {
  const url = new URL(window.location.href);

  // Clear old query parameters
  url.search = "";

  // Set the page
  url.searchParams.set("embed", page);

  // Set any additional parameters
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  window.history.pushState({}, "", url);

  sessionStorage.setItem("page", page);

  window.dispatchEvent(new Event("navigation"));
}

function Main() {
  const [page, setPage] = useState<Page>(getCurrentPage);

  useEffect(() => {
    const updatePage = () => {
      setPage(getCurrentPage());
    };

    window.addEventListener("navigation", updatePage);
    window.addEventListener("popstate", updatePage);

    return () => {
      window.removeEventListener("navigation", updatePage);
      window.removeEventListener("popstate", updatePage);
    };
  }, []);

  const CurrentPage = pages[page];

  return (
    <main>
      <CurrentPage />
    </main>
  );
}

export default Main;
