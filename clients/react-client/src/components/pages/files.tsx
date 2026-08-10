import { Routes, Route, Link } from "react-router-dom";
import Directory from "./files/directory.js";
import View from "./files/view.js";

function Files() {
  return (
    <Routes>
      <Route path="/" element={<Directory />}></Route>
      <Route path="/view/:file" element={<View />}></Route>
    </Routes>
  );
}

export default Files;
