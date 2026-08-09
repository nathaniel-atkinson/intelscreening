import { Routes, Route, NavLink } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";

import pages from "../components/pages/pages.js";

const pageList = Object.entries(pages).map(([path, module]) => {
  const Component = (module as { default: React.ComponentType }).default;

  const name = path.split("/").pop()!.replace(".tsx", "").toLowerCase();

  return {
    name,
    path: name === "home" ? "/" : `/${name}`,
    Component,
  };
});

export function Navigation() {
  const navLinkStyles = ({ isActive }: NavLinkRenderProps) => ({
    color: isActive ? "#007bff" : "#333",
    textDecoration: isActive ? "none" : "underline",
    fontWeight: isActive ? "bold" : "normal",
    padding: "5px 10px",
  });

  return (
    <>
      {pageList.map(({ name, path }) => (
        <div
          key={name}
          style={{
            width: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <NavLink to={path} style={navLinkStyles}>
            {name}
          </NavLink>
        </div>
      ))}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {pageList.map(({ name, path, Component }) => (
        <Route key={name} path={`/${path}/*`} element={<Component />} />
      ))}
    </Routes>
  );
}
export default AppRoutes;
