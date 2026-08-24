import Header from "./header.js";
import Nav from "./nav.js";
import Main from "./main.js";
import LeftAside from "./leftAside.js";
import RightAside from "./rightAside.js";
import Footer from "./footer.js";

interface FormatProps {
  leftAside?: boolean;
  rightAside?: boolean;
  header?: boolean;
  footer?: boolean;
}

function App({
  leftAside = true,
  rightAside = true,
  header = true,
  footer = true,
}: FormatProps) {
  function adjustFor(show: boolean, type: string) {
    if (type === "aside") return show ? "200px" : "";
  }

  return (
    <div
      className="body"
      style={{
        gridTemplateRows: `
          ${header ? "50px" : ""}
          50px
          1fr
          ${footer ? "50px" : ""}
        `,
      }}
    >
      {header && <Header />}

      <Nav />

      <div
        className="sandbox"
        style={{
          gridTemplateColumns: `
            ${adjustFor(leftAside, "aside")}
            1fr
            ${adjustFor(rightAside, "aside")}
          `,
        }}
      >
        {leftAside && <LeftAside />}

        <Main />

        {rightAside && <RightAside />}
      </div>

      {footer && <Footer />}
    </div>
  );
}

export default App;
