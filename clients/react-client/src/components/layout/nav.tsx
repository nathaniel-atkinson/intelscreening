import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

function Nav() {
  return (
    <>
      <BrowserRouter>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/directory">Directory</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </BrowserRouter>
    </>
  );
}

export default Nav;
