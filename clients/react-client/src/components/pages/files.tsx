import ProjectTree from "../projects/projectTree.js";
function Directory() {
  return (
    <>
      <div
        style={{
          position: "relative",
          left: "0",
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gridTemplateAreas: "title tabs",
        }}
      >
        <p
          style={{
            gridArea: "title",
            gridColumn: "1",
          }}
        >
          Directory
        </p>
      </div>

      <ProjectTree />
    </>
  );
}

export default Directory;
