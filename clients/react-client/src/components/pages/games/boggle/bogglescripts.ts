class BoggleScript {
  private word = "";
  private selectedTiles: number[] = [];

  rand(max: number) {
    return Math.floor(Math.random() * max);
  }

  randomise(): string[] {
    const dice: string[] = [
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

    // Shuffle the dice.
    for (let i = dice.length - 1; i > 0; i--) {
      const j = this.rand(i + 1);
      [dice[i], dice[j]] = [dice[j]!, dice[i]!];
    }

    // Roll each die.
    return dice.map((die) => {
      const faces = die.split("/");
      const face = faces[this.rand(faces.length)] ?? "!";

      return face.charAt(0).toUpperCase() + face.slice(1);
    });
  }

  selectTile(index: number): number[] {
    // A tile cannot be used twice in the same word.
    if (this.selectedTiles.includes(index)) {
      return this.getPermittedTiles();
    }

    // After the first selection, the next tile must be adjacent.
    const permitted = this.getPermittedTiles();

    if (this.selectedTiles.length > 0 && !permitted.includes(index)) {
      return permitted;
    }

    this.selectedTiles.push(index);
    this.updateWord();

    return this.getPermittedTiles();
  }

  getPermittedTiles(): number[] {
    if (this.selectedTiles.length === 0) {
      return Array.from({ length: 16 }, (_, i) => i);
    }

    const lastTile = this.selectedTiles[this.selectedTiles.length - 1]!;

    return this.readAdjacentTiles(lastTile).filter(
      (index) => !this.selectedTiles.includes(index),
    );
  }

  getLetter(index: number): string | undefined {
    return (
      document.querySelectorAll(".tile")[index]?.querySelector("span")
        ?.textContent ?? undefined
    );
  }

  updateWord(): void {
    this.word = this.selectedTiles
      .map((index) => this.getLetter(index) ?? "")
      .join("");

    const wordElement = document.querySelector("#word");

    if (wordElement) {
      wordElement.textContent = this.word;
    }

    // Mark the selected tiles.
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach((tile) => {
      tile.classList.toggle(
        "selected",
        this.selectedTiles.includes(Array.from(tiles).indexOf(tile)),
      );
    });

    this.hightlightAdjacent(this.getPermittedTiles());
  }

  backspace(): number[] {
    this.selectedTiles.pop();
    this.updateWord();

    return this.getPermittedTiles();
  }

  clearWord(): void {
    this.selectedTiles = [];
    this.updateWord();
  }

  readAdjacentTiles(index: number): number[] {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const adjacent: number[] = [];

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
        if (rowOffset === 0 && columnOffset === 0) continue;

        const adjacentRow = row + rowOffset;
        const adjacentColumn = column + columnOffset;

        if (
          adjacentRow < 0 ||
          adjacentRow >= 4 ||
          adjacentColumn < 0 ||
          adjacentColumn >= 4
        ) {
          continue;
        }

        adjacent.push(adjacentRow * 4 + adjacentColumn);
      }
    }

    return adjacent;
  }

  hightlightAdjacent(adjacents: number[]): void {
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach((tile, index) => {
      tile.classList.toggle("adjacent", adjacents.includes(index));
    });
  }

  async isWord(word = this.word): Promise<boolean | null> {
    if (!word.trim()) return false;

    try {
      const response = await fetch(
        `http://localhost:3000/api/dictionary/word/${encodeURIComponent(word.toLowerCase())}`,
      );

      if (!response.ok) return null;

      const data: { valid: boolean } = await response.json();
      return data.valid;
    } catch (error) {
      console.error("Dictionary lookup failed:", error);
      return null;
    }
  }
}

export default new BoggleScript();
