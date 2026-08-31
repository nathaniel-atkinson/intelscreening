import Format from "./components/layout/format.js";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import Cookies from "./utilities/cookies.js";
import { useEffect, useState } from "react";

const cookies = Cookies();

function App() {
  useEffect(() => {
    cookies.init();
  }, []);

  const [showFooter, setShowFooter] = useState(cookies.get("footer") ?? true);

  const [showHeader, setShowHeader] = useState(cookies.get("header") ?? true);

  const [showLeftAside, setShowLeftAside] = useState(
    cookies.get("leftAside") ?? true,
  );

  const [showRightAside, setShowRightAside] = useState(
    cookies.get("rightAside") ?? true,
  );

  useEffect(() => {
    const unsubscribeFooter = cookies.subscribe("footer", setShowFooter);

    const unsubscribeHeader = cookies.subscribe("header", setShowHeader);

    const unsubscribeLeftAside = cookies.subscribe(
      "leftAside",
      setShowLeftAside,
    );

    const unsubscribeRightAside = cookies.subscribe(
      "rightAside",
      setShowRightAside,
    );

    return () => {
      unsubscribeFooter();
      unsubscribeHeader();
      unsubscribeLeftAside();
      unsubscribeRightAside();
    };
  }, []);

  return (
    <BrowserRouter>
      <Format
        footer={showFooter}
        header={showHeader}
        leftAside={showLeftAside}
        rightAside={showRightAside}
      />
    </BrowserRouter>
  );
}

export default App;
