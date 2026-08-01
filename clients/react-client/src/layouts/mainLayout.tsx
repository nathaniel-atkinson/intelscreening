import Header from "../componants/header";
import Nav from "../componants/nav";
import Main from "../componants/main";
import Footer from "../componants/footer";
import Left_Aside from "../componants/left__sidePanel";
import Right_Aside from "../componants/right_sidePanel";

import "./mainLayout.css";

function App() {
  return (
    <div id="window">
      <aside className="left">
        <Left_Aside />
      </aside>
      <div id="page">
        <header>
          <Header />
        </header>
        <nav>
          <Nav />
        </nav>
        <main>
          <Main />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
      <aside className="right">
        <Right_Aside />
      </aside>
    </div>
  );
}

export default App;
