import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.js";
import Settings from "../pages/settings.js";
import Games from "../pages/games/games.js";

interface AppProps {
  format: {
    cookiepermanence: boolean;
    header: boolean;
    leftAside: boolean;
    asides: boolean;
    rightAside: boolean;
    footer: boolean;
  };
}

function App({ format }: AppProps) {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings/*" element={<Settings format={format} />} />
        <Route path="/games/*" element={<Games />} />
      </Routes>
    </main>
  );
}

export default App;
