interface AppProps {
  show?: boolean;
}

function App({ show }: AppProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "start",
        alignContent: "center",
        paddingLeft: "10px",
      }}
    >
      <div
        style={{
          display: show ? "block" : "none",
        }}
      >
        <p>Header</p>
      </div>
    </header>
  );
}

export default App;
