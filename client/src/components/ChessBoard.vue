<template>
  <div ref="board" class="board"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { Chessground } from 'chessground'
import '../../node_modules/chessground/assets/chessground.base.css'
import '../../node_modules/chessground/assets/chessground.brown.css'

const props = defineProps({
  fen: { type: String, required: true },
  dests: { type: Object, required: true },
  turnColor: { type: String, required: true }
})

const emit = defineEmits(['move'])

const board = ref(null)
let ground

onMounted(() => {
  ground = Chessground(board.value, {
    orientation: 'white',
    fen: props.fen,
    draggable: { showGhost: true },
    movable: {
      free: false,
      color: props.turnColor,
      dests: props.dests,
      events: {
        after: (orig, dest) => emit('move', { orig, dest })
      }
    }
  })
})

watch(() => props.fen, fen => {
  ground && ground.set({ fen })
})

watch(() => props.turnColor, color => {
  ground && ground.set({ movable: { color } })
})

watch(() => props.dests, dests => {
  ground && ground.set({ movable: { dests } })
})
</script>

<style scoped>
.board {
  width: 512px;
  height: 512px;
  margin: 0 auto;
}
</style>
