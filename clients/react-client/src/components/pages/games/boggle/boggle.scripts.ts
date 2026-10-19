class Scripts {
  private readonly dice: string[] = [
    "a/a/c/i/o/t",
    "a/b/i/l/t/y",
    "a/b/j/m/o/qu",
    "a/c/d/e/m/p",
    "a/c/e/l/r/s",
    "a/d/e/n/v/z",
    "a/h/m/o/r/s",
    "b/f/i/o/r/x",
    "d/e/n/o/s/w",
    "d/l/n/o/t/u",
    "e/e/f/h/i/y",
    "e/g/i/n/t/v",
    "e/g/k/l/u/y",
    "e/h/i/n/p/s",
    "e/l/p/s/t/u",
    "g/i/l/r/u/w",
  ];

  private internal() {
    return new (class {})();
  }

  public external() {
    const dice = [...this.dice];
    const rand = (max: number) => Math.rand.range(max);

    const getColumn = (index: number) => index % 4;
    const getRow = (index: number) => Math.floor(index / 4);

    return new (class {
      manageBoard() {
        return new (class {
          shuffleBoard() {
            for (let i = dice.length - 1; i > 0; i--) {
              let j = rand(i + 1);
              [dice[i], dice[j]] = [dice[i]!, dice[j]!];
            }

            return dice.map((die) => {
              const faces = die.split("/");
              const face = faces[rand(faces.length)] ?? "!";

              return face.charAt(0).toUpperCase() + face.slice(1);
            });
          }
        })();
      }

      getAdjacentTiles(index: number): number[] {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const adjacent: number[] = [];

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;

            const r = row + dr;
            const c = column + dc;

            if (r >= 0 && r < 4 && c >= 0 && c < 4) {
              adjacent.push(r * 4 + c);
            }
          }
        }

        return adjacent;
      }

      events() {
        return new (class {
          keyboard() {}

          mouse() {}
        })();
      }
    })();
  }
}

export default new Scripts().external();
