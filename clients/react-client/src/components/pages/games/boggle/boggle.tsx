import Bogglescripts from "./bogglescripts.js";
const scripts = Bogglescripts;

function Boggle() {
  scripts.setGrid();
  return (
    <div className="grid">
      <div className="tile">A</div>
    </div>
  );
}

export default Boggle;
