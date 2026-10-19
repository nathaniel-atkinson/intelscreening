import useCookie from "../../utilities/useCookie.js";
import Toggle from "../interactives/toggles.js";

const cookieNames = [
  "cookiepermanence",
  "header",
  "footer",
  "asides",
  "leftAside",
  "rightAside",
] as const;

type CookieName = (typeof cookieNames)[number];

function CookieSetting({ name }: { name: CookieName }) {
  const cookie = useCookie(name, true);

  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
      }}
    >
      <Toggle value={cookie.value} onClick={cookie.toggle} />

      <div>
        {name}={String(cookie.value)}
      </div>
    </div>
  );
}

function Settings() {
  const footer = useCookie("footer", true);

  return (
    <div
      style={{
        position: "fixed",
        top: "100px",
        left: "200px",
        right: "200px",
        bottom: footer.value ? "10px" : "50px",
        padding: "10px",
      }}
    >
      <p>Settings</p>

      <form>
        {cookieNames.map((name) => (
          <CookieSetting key={name} name={name} />
        ))}
      </form>
    </div>
  );
}

export default Settings;
