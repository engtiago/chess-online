<template>
  <ChessBoard :fen="fen" :dests="dests" :turnColor="turnColor" @move="playerMove" />
</template>

<script setup>
import { ref } from 'vue'
import { Chess, SQUARES } from 'chess.js'
import ChessBoard from './components/ChessBoard.vue'
import { createEngine } from './engine'

const chess = new Chess()
const engine = createEngine()

const fen = ref(chess.fen())
const turnColor = ref('white')
const dests = ref(computeDests())

function computeDests() {
  const map = new Map()
  for (const s of SQUARES) {
    const moves = chess.moves({ square: s, verbose: true })
    if (moves.length) map.set(s, moves.map(m => m.to))
  }
  return map
}

function updateState() {
  fen.value = chess.fen()
  turnColor.value = chess.turn() === 'w' ? 'white' : 'black'
  dests.value = computeDests()
}

async function playerMove({ orig, dest }) {
  const move = chess.move({ from: orig, to: dest, promotion: 'q' })
  if (!move) return
  updateState()
  const best = await engine.getBestMove(chess.fen())
  chess.move(best)
  updateState()
}
</script>
