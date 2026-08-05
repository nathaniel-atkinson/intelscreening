import { Routes, Route, NavLink } from "react-router-dom";

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
  return (
    <>
      {pageList.map(({ name, path }) => (
        <NavLink key={name} to={path}>
          {name}
        </NavLink>
      ))}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {pageList.map(({ name, path, Component }) => (
        <Route key={name} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}

console.log(pages);
console.log(Object.keys(pages));

export default AppRoutes;
