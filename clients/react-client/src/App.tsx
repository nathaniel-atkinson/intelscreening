import Format from "./components/layout/format.js";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import Cookies from "./utilities/cookies.js";

function App() {
  Cookies.init();

  const showFooter = Cookies.get("footer") ?? true;
  const showHeader = Cookies.get("header") ?? true;
  const showLeftAside = Cookies.get("leftAside") ?? true;
  const showRightAside = Cookies.get("rightAside") ?? true;

  return (
    <BrowserRouter>
      <Format
        footer={false}
        header={false}
        leftAside={showLeftAside}
        rightAside={showRightAside}
      />
    </BrowserRouter>
  );
}

export default App;
