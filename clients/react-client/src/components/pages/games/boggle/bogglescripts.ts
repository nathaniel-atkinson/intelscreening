class BoggleScript {
  setGrid() {
    const tile = document.querySelector(".tile");

    if (!tile) return;

    const grid = tile.parentElement;

    if (!grid) return;

    for (let i = 1; i < 16; i++) {
      const newTile = tile?.cloneNode(true) as HTMLElement;

      grid.appendChild(newTile);
    }
  }
}

export default new BoggleScript();
