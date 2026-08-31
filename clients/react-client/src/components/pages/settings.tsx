import { useState, useEffect } from "react";
import Cookies from "../../utilities/cookies.js";

const cookies = Cookies();

function App() {
  const [data, setData] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setData(cookies.data());
  }, []);

  function LoadCookies() {
    return (
      <>
        {Object.entries(data).map(([name, value]) => (
          <div key={name}>
            {name}={String(value)}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <p>Settings</p>
      <form>
        <LoadCookies />
      </form>
    </>
  );
}

export default App;
