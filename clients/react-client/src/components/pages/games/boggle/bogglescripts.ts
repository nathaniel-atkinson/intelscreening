class BoggleScript {
  private word = "";
  private selectedTiles: number[] = [];
  private wordCheckId = 0;
  private foundWords: string[] = [];
  private score = 0;
  private gameExpired = false;

  private readonly dice = [
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

  endGame(): void {
    this.gameExpired = true;
    this.wordCheckId++;
  }

  private rand(max: number): number {
    return Math.floor(Math.random() * max);
  }

  randomise(): string[] {
    const dice = [...this.dice];

    for (let i = dice.length - 1; i > 0; i--) {
      const j = this.rand(i + 1);
      [dice[i], dice[j]] = [dice[j]!, dice[i]!];
    }

    this.selectedTiles = [];
    this.word = "";
    this.foundWords = [];
    this.score = 0;
    this.wordCheckId++;

    return dice.map((die) => {
      const faces = die.split("/");
      const face = faces[this.rand(faces.length)] ?? "!";

      return face.charAt(0).toUpperCase() + face.slice(1);
    });
  }

  getLetter(index: number): string {
    return (
      document
        .querySelectorAll(".tile")
        [index]?.querySelector("span")
        ?.textContent?.toLowerCase() ?? ""
    );
  }

  getPermittedTiles(): number[] {
    if (this.gameExpired) return [];

    if (!this.selectedTiles.length) {
      return Array.from({ length: 16 }, (_, i) => i);
    }

    const last = this.selectedTiles[this.selectedTiles.length - 1]!;

    return this.readAdjacentTiles(last).filter(
      (index) => !this.selectedTiles.includes(index),
    );
  }

  selectTile(index: number): number[] {
    if (this.gameExpired) return [];

    if (this.selectedTiles.includes(index)) {
      return this.getPermittedTiles();
    }

    if (
      this.selectedTiles.length &&
      !this.getPermittedTiles().includes(index)
    ) {
      return this.getPermittedTiles();
    }

    this.selectedTiles.push(index);
    this.updateWord();

    return this.getPermittedTiles();
  }

  typeLetter(key: string): void {
    if (this.gameExpired || !/^[a-z]$/i.test(key)) return;

    const addition = key.toLowerCase() === "q" ? "qu" : key.toLowerCase();

    const target = this.word.toLowerCase() + addition;
    const path = this.findWordPath(target);

    if (!path) return;

    this.selectedTiles = path;
    this.updateWord();
  }

  private findWordPath(target: string): number[] | null {
    const previous = [...this.selectedTiles];

    const starts = Array.from({ length: 16 }, (_, i) => i).sort((a, b) => {
      const ai = previous.indexOf(a);
      const bi = previous.indexOf(b);

      return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
    });

    const search = (
      index: number,
      offset: number,
      path: number[],
    ): number[] | null => {
      const letter = this.getLetter(index);

      if (!letter || !target.startsWith(letter, offset)) {
        return null;
      }

      const nextOffset = offset + letter.length;
      const nextPath = [...path, index];

      if (nextOffset === target.length) return nextPath;
      if (nextOffset > target.length) return null;

      const adjacent = this.readAdjacentTiles(index).sort((a, b) => {
        const ai = previous.indexOf(a);
        const bi = previous.indexOf(b);

        return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
      });

      for (const next of adjacent) {
        if (nextPath.includes(next)) continue;

        const result = search(next, nextOffset, nextPath);

        if (result) return result;
      }

      return null;
    };

    for (const start of starts) {
      const result = search(start, 0, []);

      if (result) return result;
    }

    return null;
  }

  updateWord(): void {
    this.word = this.selectedTiles
      .map((index) => this.getLetter(index))
      .join("");

    const element = document.querySelector<HTMLElement>("#word");

    if (element) {
      element.textContent = this.word;
      element.style.color = "";
    }

    document.querySelectorAll(".tile").forEach((tile, index) => {
      tile.classList.toggle("selected", this.selectedTiles.includes(index));
    });

    this.highlightAdjacent(this.getPermittedTiles());
  }

  backspace(): number[] {
    if (this.gameExpired) return [];

    this.selectedTiles.pop();
    this.wordCheckId++;
    this.updateWord();

    return this.getPermittedTiles();
  }

  clearWord(): void {
    this.selectedTiles = [];
    this.word = "";
    this.wordCheckId++;
    this.updateWord();
  }

  readAdjacentTiles(index: number): number[] {
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

  highlightAdjacent(indices: number[]): void {
    document.querySelectorAll(".tile").forEach((tile, index) => {
      tile.classList.toggle("adjacent", indices.includes(index));
    });
  }

  getWord(): string {
    return this.word;
  }

  async checkWord(word = this.word): Promise<boolean | null> {
    const checkId = ++this.wordCheckId;
    const submittedWord = word.trim().toLowerCase();
    const element = document.querySelector<HTMLElement>("#word");

    if (this.gameExpired) return false;

    if (!submittedWord) {
      if (element) element.style.color = "";
      return false;
    }

    if (submittedWord.length < 3) {
      if (element) element.style.color = "red";
      return false;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/dictionary/word/${encodeURIComponent(submittedWord)}`,
      );

      if (checkId !== this.wordCheckId || this.gameExpired) {
        return false;
      }

      if (!response.ok) return null;

      const data: { valid: boolean } = await response.json();

      if (checkId !== this.wordCheckId || this.gameExpired) {
        return false;
      }

      if (element && submittedWord === this.word.toLowerCase()) {
        element.style.color = data.valid ? "green" : "red";
      }

      return data.valid;
    } catch (error) {
      if (checkId === this.wordCheckId && !this.gameExpired) {
        console.error("Dictionary lookup failed:", error);
      }

      return null;
    }
  }

  getFoundWords(): string[] {
    return [...this.foundWords];
  }

  getScore(): number {
    return this.score;
  }

  private getWordPoints(word: string): number {
    const length = word.length;

    if (length < 3) return 0;
    if (length <= 4) return 1;
    if (length === 5) return 2;
    if (length === 6) return 3;
    if (length === 7) return 5;

    return 11;
  }

  async submitWord(): Promise<boolean> {
    if (this.gameExpired) return false;

    const submittedWord = this.word.toLowerCase();

    if (submittedWord.length < 3) {
      await this.checkWord();
      return false;
    }

    if (this.foundWords.includes(submittedWord)) {
      return false;
    }

    const checkId = this.wordCheckId;
    const valid = await this.checkWord(submittedWord);

    if (
      this.gameExpired ||
      !valid ||
      submittedWord !== this.word.toLowerCase() ||
      checkId !== this.wordCheckId
    ) {
      return false;
    }

    if (this.foundWords.includes(submittedWord)) {
      return false;
    }

    this.foundWords.push(submittedWord);
    this.score += this.getWordPoints(submittedWord);

    this.clearWord();

    return true;
  }

  newGame(): string[] {
    this.gameExpired = false;
    this.selectedTiles = [];
    this.word = "";
    this.foundWords = [];
    this.score = 0;
    this.wordCheckId++;

    const letters = this.randomise();

    this.updateWord();

    return letters;
  }

  createEffects(onChange: () => void = () => {}) {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === "Enter") {
        e.preventDefault();

        void this.submitWord().then(() => onChange());
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();

        this.backspace();
        onChange();
        return;
      }

      if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault();

        this.typeLetter(e.key);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }
}

export default new BoggleScript();
