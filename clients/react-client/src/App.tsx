import MainLayout from "./components/layout/mainLayout.js";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MainLayout showHeader={false} />
    </BrowserRouter>
  );
}

export default App;
