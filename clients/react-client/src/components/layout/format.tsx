import Header from "./header.js";
import Nav from "./nav.js";
import Main from "./main.js";
import LeftAside from "./leftAside.js";
import RightAside from "./rightAside.js";
import Footer from "./footer.js";

interface FormatProps {
  cookiepermanence: boolean;
  leftAside: boolean;
  rightAside: boolean;
  asides: boolean;
  header: boolean;
  footer: boolean;
}

function App({
  cookiepermanence,
  leftAside,
  rightAside,
  asides,
  header,
  footer,
}: FormatProps) {
  const rows = [
    header ? "50px" : "0px",
    "50px",
    "1fr",
    footer ? "50px" : "0px",
  ];

  const columns = asides
    ? [leftAside ? "200px" : "50px", "1fr", rightAside ? "200px" : "50px"]
    : ["1fr"];

  const columnAreas = asides ? ["leftAside", "main", "rightAside"] : ["main"];

  return (
    <div
      className="body"
      style={{
        gridTemplateRows: rows.join(" "),
      }}
    >
      <Header show={header} />

      <Nav />

      <div
        className="sandbox"
        style={{
          gridTemplateColumns: columns.join(" "),
          gridTemplateAreas: `"${columnAreas.join(" ")}"`,
        }}
      >
        {asides && <LeftAside show={leftAside} />}

        <Main
          format={{
            cookiepermanence,
            header,
            leftAside,
            asides,
            rightAside,
            footer,
          }}
        />

        {asides && <RightAside show={rightAside} />}
      </div>

      <Footer show={footer} />
    </div>
  );
}

export default App;
