import { Routes, Route, NavLink } from "react-router-dom";
import ProjectTree from "../projects/projectTree.js";
import { nestedFilePages } from "./pages.js";

function Files() {
  const pageList: string[] = ["Directory", "View", "Bin"];

  const SubList = Object.entries(nestedFilePages).map(([path, module]) => {
    const Component = (module as { default: React.ComponentType }).default;

    const name = path.split("/").pop()!.replace(".tsx", "").toLowerCase();

    return {
      name,
      path: name === "Directory" ? "/" : `/${name}`,
      Component,
    };
  });

  function PageRoutesLinks() {
    return pageList.map((page) => {
      return (
        <NavLink to={`/files/${page}`} key={page}>
          {page}
        </NavLink>
      );
    });
  }

  function PageRoutes() {
    return SubList.map(({ path, Component }) => {
      return <Route key={path} path={path} element={<Component />}></Route>;
    });
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "50px",
          padding: "10px",
          left: "0",
          display: "flex",
          gap: "10px",
        }}
      >
        <PageRoutesLinks />
      </div>

      <Routes>{PageRoutes()}</Routes>
    </>
  );
}

export default Files;
