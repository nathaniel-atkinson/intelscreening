import Button from "./asides/button_1.js";
import { useEffect, useRef, useState } from "react";

function App() {
  const ref = useRef<HTMLElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const top = ref.current.getBoundingClientRect().top;
    setTop(top);
  }, []);

  return (
    <aside ref={ref} className="right">
      <Button buttonTop={top} side={"right"} />
      <p>rightAside</p>
    </aside>
  );
}

export default App;
