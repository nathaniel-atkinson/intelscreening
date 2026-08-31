import Clock from "../ui/clock.js";
import { NavLink } from "react-router-dom";

function App() {
  return (
    <nav>
      <div className="clock-area">
        <Clock />
      </div>
      <div
        className="nav-area"
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <NavLink to="/">Home</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </div>
    </nav>
  );
}

export default App;
