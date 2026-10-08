import Cookies from "../../utilities/cookies.js";
import Toggle from "../interactives/toggles.js";

const cookies = Cookies();

const cookieNames = [
  "cookiepermanence",
  "header",
  "footer",
  "asides",
  "leftAside",
  "rightAside",
] as const;

interface SettingsProps {
  format: {
    cookiepermanence: boolean;
    header: boolean;
    leftAside: boolean;
    asides: boolean;
    rightAside: boolean;
    footer: boolean;
  };
}

function Settings({ format }: SettingsProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: "100px",
        left: "200px",
        right: "200px",
        bottom: format.footer ? "10px" : "50px",
        padding: "10px",
      }}
    >
      <p>Settings</p>

      <form>
        {cookieNames.map((cookieName) => {
          const value = format[cookieName];

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

export default Settings;
