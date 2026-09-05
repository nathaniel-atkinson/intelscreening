interface AppProps {
  side?: "left" | "right";
  onClick?: () => void;
  state: boolean;
}

function App(gift: AppProps) {
  return (
    <span
      onClick={gift.onClick}
      style={{
        float: gift.side === "left" ? "left" : "right",
      }}
    >
      [<span>{gift.state ? "-" : "+"}</span>]
    </span>
  );
}

export default App;
