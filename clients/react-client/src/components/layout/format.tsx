import Header from "./header.js";
import Nav from "./nav.js";
import Main from "./main.js";
import LeftAside from "./leftAside.js";
import RightAside from "./rightAside.js";
import Footer from "./footer.js";

interface FormatProps {
  leftAside: boolean;
  rightAside: boolean;
  header: boolean;
  footer: boolean;
}

function App({ leftAside, rightAside, header, footer }: FormatProps) {
  const rows = [
    ...(header ? ["50px"] : []),
    "50px",
    "1fr",
    ...(footer ? ["50px"] : []),
  ];

  const columns = [
    ...(leftAside ? ["200px"] : ["50px"]),
    "1fr",
    ...(rightAside ? ["200px"] : ["50px"]),
  ];

  return (
    <div
      className="body"
      style={{
        gridTemplateRows: rows.join(" "),
      }}
    >
      {header && <Header />}

      <Nav />

      <div
        className="sandbox"
        style={{
          gridTemplateColumns: columns.join(" "),
        }}
      >
        <LeftAside show={leftAside} />

        <Main format={{ header, leftAside, rightAside, footer }} />

        <RightAside show={rightAside} />
      </div>

      {footer && <Footer />}
    </div>
  );
}

export default App;
