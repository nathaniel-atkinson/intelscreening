import Button from "./asides/button_1.js";
import useCookie from "../../utilities/useCookie.js";

interface AppProps {
  show?: boolean;
}

function App({ show = true }: AppProps) {
  const leftAside = useCookie("leftAside", true);

  return (
    <aside className="left">
      <Button side="left" state={leftAside.value} onClick={leftAside.toggle} />

      <div className="content" id="left-aside-portal" hidden={!show} />
    </aside>
  );
}

export default App;
