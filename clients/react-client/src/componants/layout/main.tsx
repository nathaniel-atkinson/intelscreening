import LeftSidePanel from "./left__sidePanel";
import RightSidePanel from "./right__sidePanel";
import ProjectTree from "../projects/projectTree";

function Main() {
  return (
    <>
      <main>
        <LeftSidePanel />
        <ProjectTree />
        <RightSidePanel />
      </main>
    </>
  );
}

export default Main();
