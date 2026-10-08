interface AppProps {
  show?: boolean;
}

function App({ show }: AppProps) {
  return (
    <footer
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
        <p>Footer</p>
      </div>
    </footer>
  );
}

export default App;
