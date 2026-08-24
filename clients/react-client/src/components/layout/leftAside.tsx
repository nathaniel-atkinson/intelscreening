import Button from "./asides/button_1.js";
import { useEffect, useRef, useState } from "react";
import Cookies from "../../utilities/cookies.js";

function App() {
  const ref = useRef<HTMLElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const top = ref.current.getBoundingClientRect().top;
    setTop(top);
  }, []);

  function handleClick() {
    const newState = Cookies.toggle("leftAsideState");
  }

  return (
    <aside ref={ref} className="left" onClick={() => handleClick()}>
      <Button buttonTop={top} side={"left"} />
      <p>leftAside</p>
    </aside>
  );
}

export default App;
