import { Routes, Route, Link } from "react-router-dom";
import ProjectTree from "../projects/projectTree.js";
import { nestedFilePages } from "./pages.js";
import View from "./files/view.js";

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
        <Link key={page} to={`/files/view/${encodeURIComponent(page)}`}>
          {page}
        </Link>
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

      <Routes>
        {PageRoutes()}
        <Route path="view/:fileName" element={<View />} />
      </Routes>
    </>
  );
}

export default Files;
