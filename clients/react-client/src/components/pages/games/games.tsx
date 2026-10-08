import { Link, Routes, Route } from "react-router-dom";
import Boggle from "./boggle/boggle.js";

function Games() {
  return (
    <div className="games">
      <nav>
        <Link to="/games/boggle">Boggle</Link>
        <Link to="/games/solitaire">Solitaire</Link>
      </nav>
      <main>
        <Routes>
          <Route path="boggle" element={<Boggle />} />
        </Routes>
      </main>
    </div>
  );
}

export default Games;
