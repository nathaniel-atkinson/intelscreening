import Header from "./header.js";
import Nav from "./nav.js";
import Main from "./main.js";
import Footer from "./footer.js";
import Left_Aside from "./left__sidePanel.js";
import Right_Aside from "./right__sidePanel.js";
import "./layout.css";

interface LayoutProps {
  showHeader?: boolean;
  showNav?: boolean;
  showLeftAside?: boolean;
  showRightAside?: boolean;
  showFooter?: boolean;
}

function MainLayout({
  showHeader = true,
  showNav = true,
  showLeftAside = true,
  showRightAside = true,
  showFooter = true,
}: LayoutProps) {
  const rows = [
    showHeader && "50px",
    showNav && "50px",
    "1fr",
    showFooter && "50px",
  ]
    .filter(Boolean)
    .join(" ");

  const columns = [showLeftAside && "200px", "1fr", showRightAside && "200px"]
    .filter(Boolean)
    .join(" ");

  const layoutAreas = [
    showHeader && `"header"`,
    showNav && `"nav"`,
    `"main"`,
    showFooter && `"footer"`,
  ]
    .filter(Boolean)
    .join("\n");

  const boardAreas = `"${[
    showLeftAside && "left_aside",
    "main",
    showRightAside && "right_aside",
  ]
    .filter(Boolean)
    .join(" ")}"`;

  return (
    <div
      data-type="screen"
      style={{
        display: "grid",
        gridTemplateRows: rows,
        gridTemplateAreas: layoutAreas,
      }}
    >
      {showHeader && <Header />}

      {showNav && <Nav />}

      <div
        id="board"
        style={{
          display: "grid",
          gridTemplateColumns: columns,
          gridTemplateAreas: boardAreas,
        }}
      >
        {showLeftAside && <Left_Aside />}

        <Main />

        {showRightAside && <Right_Aside />}
      </div>

      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
