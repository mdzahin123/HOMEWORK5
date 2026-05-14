# React Games

Two classic games — Snake and Tic-Tac-Toe — built with React. There's a navbar that lets you switch between them, and your Snake high score is saved in localStorage.

## Tech

- React 19
- React Router 7
- Create React App

## Running locally

```bash
git clone <repo-url>
cd react-games
npm install
npm start
```

Then open http://localhost:3000.

### Scripts

- `npm start` — dev server
- `npm test` — run unit tests
- `npm run build` — production build
- `npm run deploy` — deploy to GitHub Pages

## Games

**Tic-Tac-Toe** — pick X or O, choose who goes first, play against a bot. The bot tries to win, blocks you if it can't win, otherwise plays center/corner/random.

**Snake** — arrow keys or WASD to move. Space starts the game or pauses it. The snake speeds up a little each time you eat food. High score is saved.

## Project layout

```
src/
├── App.js               // routes + navbar + home page
├── App.css
├── SnakeGame.js         // snake game
├── SnakeGame.css
├── TicTacToe.js         // tic-tac-toe game
├── TicTacToe.css
├── ticTacToeLogic.js    // bot logic + win checking
└── ticTacToeLogic.test.js
```

## Deploying to GitHub Pages

Add a `homepage` field to `package.json`:

```json
"homepage": "https://<your-username>.github.io/react-games"
```

Then run `npm run deploy`. In your repo settings → Pages, set the source to the `gh-pages` branch.
