import { createPortal } from "react-dom";

interface AppProps {
  buttonTop: number;
  side: string;
}

function App({ buttonTop, side }: AppProps) {
  function getSide() {
    if (side === "left") return { left: 0 };
    if (side === "right") return { right: 0 };

    return {};
  }

  return createPortal(
    <span
      style={{
        position: "absolute",
        top: `${buttonTop}px`,
        ...getSide(),
      }}
    >
      [<span>+</span>]
    </span>,
    document.body,
  );
}

export default App;
