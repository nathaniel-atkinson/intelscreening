import Home from "../pages/home/home";
import Directory from "../pages/directory/directory";
import Settings from "../pages/settings/settings";
import Modal from "../pages/modals/modals";

import { useState } from "react";

function Main() {
  const pages = {
    home: Home,
    directory: Directory,
    settings: Settings,
    modal: Modal,
  } as const;

  type Page = keyof typeof pages;

  const [page, setPage] = useState<Page>("modal");

  const CurrentPage = pages[page];

  return (
    <main>
      <CurrentPage />
    </main>
  );
}

export default Main;
