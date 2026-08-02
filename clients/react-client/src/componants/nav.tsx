import { navigate } from "./main";

function Nav() {
  return (
    <nav>
      <button onClick={() => navigate("home")}>Home</button>
      <button onClick={() => navigate("directory")}>Directory</button>
      <button onClick={() => navigate("settings")}>Settings</button>
    </nav>
  );
}

export default Nav;
