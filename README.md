# Chess Online

This project provides a basic chess board using Vue 3 with the Chessground UI.
Game rules are handled by `chess.js` and a simple AI is powered by `stockfish.js`.

## Development

Install dependencies and start the dev server:

```bash
cd client
npm install
npm run dev
```

## Features

- Chessground powered board with coordinates
- `chess.js` for move validation
- AI opponent using `stockfish.js`
- Moves are made by dragging pieces and the engine replies automatically
- Includes the Cburnett piece set from Chessground for a classic look
