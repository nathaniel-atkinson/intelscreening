import Button from "./asides/button_1.js";
import { useEffect, useState } from "react";
import Cookies from "../../utilities/cookies.js";

const cookies = Cookies();

interface AppProps {
  show?: boolean;
}

function App({ show = true }: AppProps) {
  const [state, setState] = useState(cookies.get("rightAside") ?? true);

  useEffect(() => {
    return cookies.subscribe("rightAside", setState);
  }, []);

  function handleClick() {
    cookies.toggle("rightAside");
  }

  return (
    <aside className="right">
      <Button side="right" state={state} onClick={handleClick} />

      {show && (
        <div className="content">
          <p>rightAside</p>
        </div>
      )}
    </aside>
  );
}

export default App;
