import Button from "./asides/button_1.js";
import { useEffect, useState } from "react";
import Cookies from "../../utilities/cookies.js";

const cookies = Cookies();

interface AppProps {
  show?: boolean;
}

function App({ show = true }: AppProps) {
  const [state, setState] = useState(cookies.get("leftAside") ?? true);

  useEffect(() => {
    return cookies.subscribe("leftAside", setState);
  }, []);

  function handleClick() {
    cookies.toggle("leftAside");
  }

  return (
    <aside className="left">
      <Button side="left" state={state} onClick={handleClick} />

      {show && (
        <div className="content">
          <p>leftAside</p>
        </div>
      )}
    </aside>
  );
}

export default App;
