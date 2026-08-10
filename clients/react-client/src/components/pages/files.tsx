import { Routes, Route, Link } from "react-router-dom";
import { nestedFilePages } from "./pages.js";
import View from "./files/view.js";

function Files() {
  const SubList = Object.entries(nestedFilePages).map(([path, module]) => {
    const Component = (
      module as {
        default: React.ComponentType;
      }
    ).default;

    const name = path.split("/").pop()!.replace(".tsx", "").toLowerCase();

    return {
      name,
      path: name === "directory" ? "/" : `/${name}`,
      Component,
    };
  });

  function PageRoutesLinks() {
    return SubList.map(({ name, path }) => (
      <Link key={path} to={`/files${path}`}>
        {name}
      </Link>
    ));
  }

  function PageRoutes() {
    return SubList.map(({ path, Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ));
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
