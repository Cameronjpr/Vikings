const canvas = document.getElementById('canvas')
const infoBarGold = document.getElementById('infobar-gold')
const infoBarHealth = document.getElementById('infobar-health')
const infoBarDay = document.getElementById('infobar-day')
const infoBarAge = document.getElementById('infobar-age')
const ctx = canvas.getContext('2d')

ctx.font = '16px sans-serif'

const tileSize = 40
const gridSpan = 16
let grid = []
let hovered = { x: null, y: null }
let ship = { x: 2, y: 7 }
let gold = 0
let day = 1
let age = 18
let season = 1
let seasonNames = ['Spring', 'Summer', 'Autumn', 'Winter']
let health = 100

function init() {
  for (let i = 0; i < gridSpan; i++) {
    grid[i] = []
    for (let j = 0; j < gridSpan; j++) {
      if (Math.abs(i - ship.y) <= 1 && Math.abs(j - ship.x) <= 1) {
        grid[i][j] = {
          type: 'sea',
          fog: false,
        }
      } else {
        grid[i][j] = {
          type: 'sea',
          fog: true,
        }
      }
    }
  }

  grid = seedCoastline(grid)
  updateInfobar()
  window.requestAnimationFrame(gameLoop)
}

function draw() {
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.fog) {
        ctx.fillStyle = 'gainsboro'
      } else {
        switch (cell.type) {
          case 'coastline':
            ctx.fillStyle = 'lightgoldenrodyellow'
            break
          case 'land':
            ctx.fillStyle = season === 4 ? 'ghostwhite' : 'limegreen'
            break
          case 'sea':
            ctx.fillStyle = 'dodgerblue'
            break
          case 'cliff':
            ctx.fillStyle = 'saddlebrown'
          default:
            ctx.fillStyle = 'transparent'
        }
      }

      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
    })
  })

  // draw ship
  ctx.fillStyle = 'saddlebrown'
  ctx.fillRect(ship.x * tileSize + 5, ship.y * tileSize + 16, 30, 8)
  ctx.fillStyle = 'white'
  ctx.fillRect(ship.x * tileSize + 15, ship.y * tileSize + 8, 4, 10)

  if (hovered.x !== null && hovered.y !== null) {
    let actionText = ''
    ctx.strokeStyle = 'orange'
    ctx.fillStyle = 'transparent'
    ctx.strokeRect(hovered.x, hovered.y, tileSize, tileSize)

    ctx.strokeStyle = 'black'
    const hoveredTile = grid[hovered.y / tileSize][hovered.x / tileSize]

    switch (hoveredTile.type) {
      case 'land':
        actionText = 'Raid'
        break
      case 'sea':
        actionText = 'Sail'
        break
      default:
        ''
    }

    ctx.fillStyle = 'black'
    ctx.fillText(actionText, hovered.x + 2, hovered.y + 40)
  }
}

function gameLoop(timestamp) {
  draw()
  window.requestAnimationFrame(gameLoop)
}

canvas.addEventListener('mousemove', function (e) {
  const cursorPos = getCursorPosition(canvas, e)
  hovered = { x: cursorPos.roundX, y: cursorPos.roundY }
})

canvas.addEventListener('click', function (e) {
  const cursorPos = getCursorPosition(canvas, e)
  // grid[cursorPos.roundY / tileSize][cursorPos.roundX / tileSize] = 1

  const { roundX, roundY } = cursorPos
  const xDiff = Math.abs(roundX / tileSize - ship.x)
  const yDiff = Math.abs(roundY / tileSize - ship.y)

  // Diagonal moves are not allowed
  if (xDiff + yDiff === 2) {
    return
  }

  // Don't allow moving onto land
  if (grid[roundY / tileSize][roundX / tileSize].type === 'land') {
    attemptRaid()
    advanceDay()
    return
  }

  if (xDiff <= 1 && yDiff <= 1) {
    ship.x = roundX / tileSize
    ship.y = roundY / tileSize
    clearFog(ship)
    advanceDay()
  }
})

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  return {
    x,
    y,
    roundX: Math.floor(x / tileSize) * tileSize,
    roundY: Math.floor(y / tileSize) * tileSize,
  }
}

function advanceDay() {
  day += 1

  if (day > 30) {
    day = 1
    season += 1

    if (season > 4) {
      season = 1
      age += 1
    }
  }

  if (health !== 100) {
    if (Math.random() > 0.5) {
      health += Math.round(Math.random() * 10)
    }
  }

  ageViking()
  updateInfobar()
}

function ageViking() {
  const healthPenalty = Math.round(Math.random() * day)
  console.log(healthPenalty)
}

function attemptRaid() {
  const raidRoll = Math.random()

  if (raidRoll > 0.5) {
    gold += 5
    console.log('successful raid, gold +5. Total gold: ' + gold)
  } else {
    health -= 10
    console.log('raid failed, health -10. Total health: ' + health)
  }
}

function updateInfobar() {
  infoBarGold.innerText = 'Gold: ' + gold
  infoBarHealth.innerText = 'Health: ' + health
  infoBarDay.innerText = 'Day: ' + day + ' of ' + seasonNames[season - 1]
  infoBarAge.innerText = `${age} years old`
}

function resetGame() {
  gold = 0
  health = 100
  day = 1
  season = 1
  ship = { x: 2, y: 7 }
  init()
}

init()
draw()
