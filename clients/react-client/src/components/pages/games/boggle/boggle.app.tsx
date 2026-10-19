import { useState } from "react";
import Scripts from "./boggle.scripts.js";

const Board = Scripts.manageBoard();
const Shuffle = () => Board.shuffleBoard();

function Boggle() {
  const [board, setBoard] = useState<string[]>(() => Shuffle());

  return (
    <>
      <span>Boggle</span>
      <div className="grid" onContextMenu={(e) => e.preventDefault()}>
        <Tile board={board} />
      </div>
      <button onClick={() => setBoard(Shuffle())}>Reset Board</button>
    </>
  );
}

export default Boggle;

function Tile({ board }: { board: string[] }) {
  return (
    <>
      {board.map((die: string, index: number) => {
        const column = index % 4;
        const row = Math.floor(index / 4) + 1;

        return (
          <div
            data-class="tile"
            key={index}
            data-index={index}
            data-letter={index}
            style={{ gridColumn: column, gridRow: row }}
            onClick={(e) => e.currentTarget.class("selected", true, true)}
            onContextMenu={(e) => {
              e.currentTarget.class("selected", false, true);
            }}
          >
            <span
              onMouseOver={(e) => e.currentTarget.class("highlighted", true)}
              onMouseLeave={(e) => e.currentTarget.class("highlighted", false)}
            >
              {die}
            </span>
          </div>
        );
      })}
    </>
  );
}
