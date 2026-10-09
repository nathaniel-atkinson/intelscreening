import { useState } from "react";
import Bogglescripts from "./bogglescripts.js";

function Boggle() {
  const [letters, setLetters] = useState<string[]>(() =>
    Bogglescripts.randomise(),
  );

  function Tile() {
    return (
      <>
        {letters.map((letter, index) => {
          const column = (index % 4) + 1;
          const row = Math.floor(index / 4) + 1;

          return (
            <div
              className="tile"
              key={index}
              style={{
                gridColumn: column,
                gridRow: row,
              }}
              onClick={() => {
                const adjacent = Bogglescripts.selectTile(index);
                console.log(adjacent);
              }}
            >
              <span>{letter}</span>
            </div>
          );
        })}
      </>
    );
  }
  return (
    <>
      <div className="grid">
        <Tile />
      </div>
      <br></br>
      <h1>
        Word: <span id="word"></span>
      </h1>
      <button onClick={() => Bogglescripts.backspace()}>Backspace</button>
      <button
        onClick={async () => {
          const result = await Bogglescripts.isWord();

          if (result === true) {
            console.log("Valid word");
          } else if (result === false) {
            console.log("Word not found");
          } else {
            console.log("Could not check word; try again later");
          }
        }}
      >
        Check Word
      </button>
      <button onClick={() => setLetters(Bogglescripts.randomise())}>
        Randomise
      </button>
      <p id="data">
        Tile/Grid Data: [<span></span>]
      </p>
    </>
  );
}

export default Boggle;
