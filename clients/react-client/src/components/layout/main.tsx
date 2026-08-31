import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.js";
import Settings from "../pages/settings.js";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
      </Routes>
    </main>
  );
}

export default App;
