import Button from "./asides/button_1.js";
import { useEffect, useRef, useState } from "react";
import Cookies from "../../utilities/cookies.js";

const cookies = Cookies();

function App() {
  const ref = useRef<HTMLElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const top = ref.current.getBoundingClientRect().top;
    setTop(top);
  }, []);

  function handleClick() {
    const newState = cookies.toggle("rightAside");
  }

  return (
    <>
      <aside ref={ref} className="left" onClick={() => handleClick()}>
        <Button buttonTop={top} side={"right"} />
        <div className="content">
          <p>rightAside</p>
        </div>
      </aside>
    </>
  );
}

export default App;
