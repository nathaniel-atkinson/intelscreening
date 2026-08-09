import { NavLink } from "react-router-dom";
import Clock from "../ui/clock.js";
import { Navigation } from "../../routes/routes.js";

function Nav() {
  return (
    <nav
      data-type="mainLayoutComponent"
      style={{
        gridArea: "nav",
        display: "grid",
        gridTemplateColumns: "200px 1fr 200px",
        gridTemplateAreas: `"clock navbar right"`,
      }}
    >
      <div
        id="clock"
        style={{
          gridArea: "clock",
        }}
      >
        <Clock />
      </div>
      <div
        data-place="center"
        style={{
          gridArea: "navbar",
        }}
      >
        <Navigation />
      </div>
      <div
        style={{
          gridArea: "right",
        }}
      ></div>
    </nav>
  );
}

export default Nav;
