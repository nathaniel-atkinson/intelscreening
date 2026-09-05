import { useEffect, useState } from "react";
import Cookies from "../../utilities/cookies.js";
import Toggle from "../interactives/toggles.js";

const cookies = Cookies();

const cookieNames = ["footer", "header", "leftAside", "rightAside"] as const;

interface AppProps {
  format: {
    header: boolean;
    leftAside: boolean;
    rightAside: boolean;
    footer: boolean;
  };
}

function App({ format }: AppProps) {
  const [data, setData] = useState(cookies.data());

  const { header, leftAside, rightAside, footer } = format;

  useEffect(() => {
    const unsubscribe = cookieNames.map((name) =>
      cookies.subscribe(name, () => {
        setData(cookies.data());
      }),
    );

    return () => {
      unsubscribe.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return (
    <div
      style={{
        top: header ? "0px" : "50px",
        left: leftAside ? "0px" : "150px",
        right: rightAside ? "0px" : "150px",
        bottom: footer ? "0px" : "50px",
      }}
    >
      <p>Settings</p>

      <form>
        {Object.entries(data).map(([name, value]) => {
          const cookieName = name as (typeof cookieNames)[number];

          return (
            <div
              key={cookieName}
              style={{
                display: "flex",
                gap: "5px",
              }}
            >
              <Toggle
                value={value}
                onClick={() => cookies.toggle(cookieName)}
              />

              <div>
                {cookieName}={String(value)}
              </div>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export default App;
