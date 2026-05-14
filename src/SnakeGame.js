import { useState, useEffect, useRef, useCallback } from 'react';
import './SnakeGame.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 70;
const SPEED_STEP = 2;

const initialSnake = () => [{ x: 10, y: 10 }];

function spawnFood(snake) {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  while (true) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!occupied.has(`${x},${y}`)) return { x, y };
  }
}

function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [highScore, setHighScore] = useState(0);

  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const directionRef = useRef(direction);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved, 10) || 0);
  }, []);

  const startGame = useCallback(() => {
    const fresh = initialSnake();
    setSnake(fresh);
    setFood(spawnFood(fresh));
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
    setGameStarted(true);
  }, []);

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else {
          setIsPaused(p => !p);
        }
        return;
      }

      const current = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (current !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, startGame]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const tick = () => {
      const prevSnake = snakeRef.current;
      const currentFood = foodRef.current;
      const dir = directionRef.current;

      const head = { ...prevSnake[0] };
      if (dir === 'UP') head.y -= 1;
      else if (dir === 'DOWN') head.y += 1;
      else if (dir === 'LEFT') head.x -= 1;
      else if (dir === 'RIGHT') head.x += 1;

      const hitWall =
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE;
      const hitSelf = prevSnake.some(s => s.x === head.x && s.y === head.y);

      if (hitWall || hitSelf) {
        setGameOver(true);
        return;
      }

      const ateFood = head.x === currentFood.x && head.y === currentFood.y;
      const nextSnake = ateFood
        ? [head, ...prevSnake]
        : [head, ...prevSnake.slice(0, -1)];

      setSnake(nextSnake);

      if (ateFood) {
        setFood(spawnFood(nextSnake));
        setScore(s => s + 10);
        setSpeed(sp => Math.max(sp - SPEED_STEP, MIN_SPEED));
      }
    };

    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [gameStarted, gameOver, isPaused, speed]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', String(score));
    }
  }, [gameOver, score, highScore]);

  const renderBoard = () => {
    if (snake.length === 0) return null;
    const head = snake[0];
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isHead = head.x === x && head.y === y;
        const isBody = !isHead && snake.some(s => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;

        let className = 'cell';
        if (isHead) className += ' snake-head';
        else if (isBody) className += ' snake-body';
        if (isFood) className += ' food';

        cells.push(
          <div
            key={`${x}-${y}`}
            className={className}
            style={{
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        );
      }
    }
    return cells;
  };

  const changeDirection = (next) => {
    const current = directionRef.current;
    const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (opposites[next] !== current) setDirection(next);
  };

  return (
    <div className="game-container">
      <h1>Snake Game</h1>

      <div className="game-info">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
        {gameStarted && !gameOver && (
          <button onClick={() => setIsPaused(p => !p)}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>

      <div
        className="game-board"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {renderBoard()}

        {gameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}

        {!gameStarted && !gameOver && (
          <div className="game-start">
            <h2>Snake Game</h2>
            <p>Use arrow keys or WASD to move</p>
            <p>Press space to start or pause</p>
            <button onClick={startGame}>Start Game</button>
          </div>
        )}
      </div>

      <div className="controls">
        {gameStarted && !gameOver && (
          <div className="mobile-controls">
            <button className="control-up" onClick={() => changeDirection('UP')}>↑</button>
            <div>
              <button className="control-left" onClick={() => changeDirection('LEFT')}>←</button>
              <button className="control-right" onClick={() => changeDirection('RIGHT')}>→</button>
            </div>
            <button className="control-down" onClick={() => changeDirection('DOWN')}>↓</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SnakeGame;
