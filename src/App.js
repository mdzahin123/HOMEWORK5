import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import SnakeGame from './SnakeGame';
import TicTacToe from './TicTacToe';
import './App.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to React Games!</h1>
      <div className="card-container">
        <div className="game-card">
          <h2>Snake Game</h2>
          <img src="/snake-game.png" alt="Snake Game" className="game-image" />
          <button onClick={() => navigate('/snake')}>Play Snake</button>
        </div>
        <div className="game-card">
          <h2>Tic Tac Toe</h2>
          <img src="/tic-tac-toe.png" alt="Tic Tac Toe" className="game-image" />
          <button onClick={() => navigate('/tictactoe')}>Play Tic Tac Toe</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/snake">Snake Game</Link>
          <Link to="/tictactoe">Tic Tac Toe</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
