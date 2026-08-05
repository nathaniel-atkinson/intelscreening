import AppRoutes from "../../routes/routes.js";
import "./layout.css";
import App from "../../App.js";

function Main() {
  return (
    <main
      data-type="mainLayoutComponent"
      style={{
        gridArea: "main",
      }}
    >
      <AppRoutes />
    </main>
  );
}

export default Main;
