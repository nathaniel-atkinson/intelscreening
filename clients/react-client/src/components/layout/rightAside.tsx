import Button from "./asides/button_1.js";
import useCookie from "../../utilities/useCookie.js";

interface AppProps {
  show?: boolean;
}

function App({ show = true }: AppProps) {
  const rightAside = useCookie("rightAside", true);

  return (
    <aside className="right">
      <Button
        side="right"
        state={rightAside.value}
        onClick={rightAside.toggle}
      />

      <div className="content" id="right-aside-portal" hidden={!show} />
    </aside>
  );
}

export default App;
