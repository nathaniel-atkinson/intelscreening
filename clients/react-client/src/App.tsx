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

  const [cookiePermanence, setCookiePermanence] = useState(
    cookies.get("asides") ?? true,
  );

  const [showAsides, setShowAsides] = useState(cookies.get("asides") ?? true);

  const [showFooter, setShowFooter] = useState(cookies.get("footer") ?? true);

  const [showHeader, setShowHeader] = useState(cookies.get("header") ?? true);

  const [showLeftAside, setShowLeftAside] = useState(
    cookies.get("leftAside") ?? true,
  );

  const [showRightAside, setShowRightAside] = useState(
    cookies.get("rightAside") ?? true,
  );

  useEffect(() => {
    const unsubscribeCookiePermanence = cookies.subscribe(
      "cookiepermanence",
      setCookiePermanence,
    );

    const unsubscribeFooter = cookies.subscribe("footer", setShowFooter);

    const unsubscribeHeader = cookies.subscribe("header", setShowHeader);

    const unsubscribeAsides = cookies.subscribe("asides", setShowAsides);

    const unsubscribeLeftAside = cookies.subscribe(
      "leftAside",
      setShowLeftAside,
    );

    const unsubscribeRightAside = cookies.subscribe(
      "rightAside",
      setShowRightAside,
    );

    return () => {
      unsubscribeCookiePermanence();
      unsubscribeFooter();
      unsubscribeHeader();
      unsubscribeAsides();
      unsubscribeLeftAside();
      unsubscribeRightAside();
    };
  }, []);

  return (
    <BrowserRouter>
      <Format
        cookiepermanence={cookiePermanence}
        footer={showFooter}
        header={showHeader}
        asides={showAsides}
        leftAside={showLeftAside}
        rightAside={showRightAside}
      />
    </BrowserRouter>
  );
}

export default App;
