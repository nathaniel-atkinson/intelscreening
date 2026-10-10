import { useState, useEffect } from "react";
import Bogglescripts from "./bogglescripts.js";
import CountdownTimer from "../countdowntimers.js";

function Boggle() {
  const [letters, setLetters] = useState<string[]>(() =>
    Bogglescripts.randomise(),
  );

  const [gameId, setGameId] = useState(0);
  const [timedMode, setTimedMode] = useState(false);
  const [gameExpired, setGameExpired] = useState(false);

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    return Bogglescripts.createEffects(() => {
      setFoundWords(Bogglescripts.getFoundWords());
      setScore(Bogglescripts.getScore());
    });
  }, []);

  async function checkWord() {
    if (gameExpired) return;

    const result = await Bogglescripts.checkWord();

    setFoundWords(Bogglescripts.getFoundWords());
    setScore(Bogglescripts.getScore());

    if (result === null) {
      console.log("Could not check word; try again later");
    } else if (result === false) {
      console.log("Word not found");
    }
  }

  function newGame(withTimer: boolean) {
    Bogglescripts.newGame();

    setLetters(Bogglescripts.randomise());
    setFoundWords(Bogglescripts.getFoundWords());
    setScore(Bogglescripts.getScore());

    setGameExpired(false);
    setTimedMode(withTimer);
    setGameId((id) => id + 1);
  }

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
              style={{ gridColumn: column, gridRow: row }}
              onClick={() => {
                if (!gameExpired) {
                  Bogglescripts.selectTile(index);
                }
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
      <CountdownTimer
        gameId={gameId}
        enabled={timedMode}
        onExpire={() => {
          Bogglescripts.endGame();
          setGameExpired(true);
        }}
      />

      {gameExpired && <p>Time is up! Start a new game to play again.</p>}

      <div className="grid">
        <Tile />
      </div>

      <br />

      <h1>
        Word: <span id="word"></span>
      </h1>

      <button onClick={checkWord} disabled={gameExpired}>
        Check Word
      </button>

      <button onClick={() => newGame(false)}>New Game</button>

      <button onClick={() => newGame(true)}>New Game with Timer</button>

      <p id="data">
        Tile/Grid Data: [<span></span>]
      </p>

      <h2>Score: {score}</h2>

      <h2>Found Words ({foundWords.length})</h2>

      <div className="word-list">
        <ul>
          {foundWords.map((word) => (
            <li key={word}>
              {word.toUpperCase()} — {word.length} letters —{" "}
              {word.length <= 4
                ? 1
                : word.length === 5
                  ? 2
                  : word.length === 6
                    ? 3
                    : word.length === 7
                      ? 5
                      : 11}{" "}
              points
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Boggle;
