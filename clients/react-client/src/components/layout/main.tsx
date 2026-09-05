import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.js";
import Settings from "../pages/settings.js";

interface AppProps {
  format: {
    header: boolean;
    leftAside: boolean;
    rightAside: boolean;
    footer: boolean;
  };
}

function App({ format }: AppProps) {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings format={format} />} />
      </Routes>
    </main>
  );
}

export default App;
