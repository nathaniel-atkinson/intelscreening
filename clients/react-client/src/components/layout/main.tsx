import LeftSidePanel from "./left__sidePanel";
import RightSidePanel from "./right__sidePanel";
import ProjectTree from "../projects/projectTree";

function Main() {
  return (
    <>
      <LeftSidePanel />
      <ProjectTree />
      <RightSidePanel />
    </>
  );
}

export default Main;
