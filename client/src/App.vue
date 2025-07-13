<template>
  <div id="game-container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Phaser from 'phaser'

const tileSize = 64
const boardSize = 8
let game

function createBoard(scene) {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const color = (x + y) % 2 === 0 ? 0xffffff : 0xaaaaaa
      const square = scene.add.rectangle(
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize,
        color
      ).setOrigin(0)
      square.setInteractive()
      square.on('pointerup', () => {
        handleSquareClick(scene, x, y)
      })
    }
  }
}

const pieces = []
let selectedPiece = null

const initialBoard = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
]

function createPieces(scene) {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const code = initialBoard[y][x]
      if (code) {
        const color = code === code.toUpperCase() ? '#ffffff' : '#000000'
        const text = scene.add.text(
          x * tileSize + tileSize/2,
          y * tileSize + tileSize/2,
          code.toUpperCase(),
          { color, fontSize: 32 }
        ).setOrigin(0.5)
        text.setData('pos', {x, y})
        text.setData('code', code)
        text.setInteractive()
        text.on('pointerup', () => handlePieceClick(scene, text))
        pieces.push(text)
      }
    }
  }
}

function getPieceAt(x, y) {
  return pieces.find(p => p.getData('pos').x === x && p.getData('pos').y === y)
}

function isValidMove(code, fromX, fromY, toX, toY) {
  const dx = toX - fromX
  const dy = toY - fromY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  const sign = code === code.toUpperCase() ? -1 : 1 // white pieces move up
  switch(code.toLowerCase()) {
    case 'p':
      if (dx === 0 && dy === sign) return true
      if (absDx === 1 && dy === sign && getPieceAt(toX, toY)) return true
      return false
    case 'r':
      return dx === 0 || dy === 0
    case 'b':
      return absDx === absDy
    case 'q':
      return dx === 0 || dy === 0 || absDx === absDy
    case 'k':
      return absDx <= 1 && absDy <= 1
    case 'n':
      return absDx * absDy === 2
    default:
      return false
  }
}

function handlePieceClick(scene, piece) {
  if (selectedPiece) {
    selectedPiece.setStyle({ backgroundColor: null })
  }
  selectedPiece = piece
  selectedPiece.setStyle({ backgroundColor: '#888' })
}

function handleSquareClick(scene, x, y) {
  if (!selectedPiece) return
  const {x: fromX, y: fromY} = selectedPiece.getData('pos')
  const code = selectedPiece.getData('code')
  if (!isValidMove(code, fromX, fromY, x, y)) return
  const targetPiece = getPieceAt(x, y)
  if (targetPiece && targetPiece.getData('code').toUpperCase() === code.toUpperCase()) return

  if (targetPiece) {
    scene.tweens.add({
      targets: targetPiece,
      alpha: 0,
      duration: 200,
      onComplete: () => targetPiece.destroy()
    })
  }

  selectedPiece.setPosition(x * tileSize + tileSize/2, y * tileSize + tileSize/2)
  selectedPiece.setData('pos', {x, y})
  selectedPiece.setStyle({ backgroundColor: null })
  selectedPiece = null
}

onMounted(() => {
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: tileSize * boardSize,
    height: tileSize * boardSize,
    backgroundColor: '#222222',
    scene: {
      preload() {},
      create() {
        createBoard(this)
        createPieces(this)
      },
      update() {}
    }
  }

  game = new Phaser.Game(config)
})
</script>

<style>
#game-container {
  margin: 0 auto;
  width: fit-content;
}
</style>
