function seedCoastline(grid) {
  for (let i = 0; i < grid.length; i++) {
    const x = Math.floor(Math.random() * 16)
    const y = Math.floor(Math.random() * 16)
    grid[y][x] = { type: 'land', fog: true }

    for (let bi = -1; bi < 2; bi++) {
      for (let bj = -1; bj < 2; bj++) {
        if (y + bi < 0 || y + bi > 15 || x + bj < 0 || x + bj > 15) {
          continue
        }
        if (bi === 0 && bj === 0) {
          continue
        }
        if (Math.random() > 0.8) {
          grid[y + bi][x + bj] = { type: 'land', fog: true }
        }
      }
    }
  }

  return grid
}

function clearFog(ship) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (
        ship.x + i >= 0 &&
        ship.x + i < 16 &&
        ship.y + j >= 0 &&
        ship.y + j < 16
      ) {
        grid[ship.y + j][ship.x + i].fog = false
      }
    }
  }
}
