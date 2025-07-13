import StockfishWorker from 'stockfish/src/stockfish-nnue-16-single.js?worker'

export function createEngine() {
  const worker = new StockfishWorker()
  worker.postMessage('uci')

  function send(cmd) {
    worker.postMessage(cmd)
  }

  function getBestMove(fen, depth = 12) {
    return new Promise(resolve => {
      const handler = e => {
        const line = typeof e.data === 'string' ? e.data : ''
        if (line.startsWith('bestmove')) {
          worker.removeEventListener('message', handler)
          resolve(line.split(' ')[1])
        }
      }
      worker.addEventListener('message', handler)
      send('position fen ' + fen)
      send('go depth ' + depth)
    })
  }

  return { send, getBestMove }
}
