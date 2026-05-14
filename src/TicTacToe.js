import { useState, useEffect, useCallback } from 'react';
import { checkWinner, pickBotMove } from './ticTacToeLogic';
import './TicTacToe.css';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [computerSymbol, setComputerSymbol] = useState(null);
  const [whoStartsChosen, setWhoStartsChosen] = useState(false);

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn || !whoStartsChosen) return;
    const next = [...board];
    next[index] = playerSymbol;
    setBoard(next);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (!playerSymbol || !whoStartsChosen) return;

    const result = checkWinner(board);
    if (result) {
      setWinner(result);
      return;
    }

    if (!isPlayerTurn) {
      const timer = setTimeout(() => {
        const move = pickBotMove(board, computerSymbol, playerSymbol);
        if (move === undefined) return;
        const next = [...board];
        next[move] = computerSymbol;
        setBoard(next);
        setIsPlayerTurn(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn, playerSymbol, computerSymbol, whoStartsChosen]);

  const chooseSymbol = (symbol) => {
    setPlayerSymbol(symbol);
    setComputerSymbol(symbol === 'X' ? 'O' : 'X');
  };

  const chooseWhoStarts = useCallback((playerFirst) => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(playerFirst);
    setWhoStartsChosen(true);
  }, []);

  const resetGame = () => {
    setPlayerSymbol(null);
    setComputerSymbol(null);
    setWhoStartsChosen(false);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="ttt-container">
      <h1>Tic Tac Toe</h1>

      {!playerSymbol && (
        <div className="choose-symbol">
          <p>Choose your symbol:</p>
          <button onClick={() => chooseSymbol('X')}>Play as X</button>
          <button onClick={() => chooseSymbol('O')}>Play as O</button>
        </div>
      )}

      {playerSymbol && !whoStartsChosen && (
        <div className="choose-symbol">
          <p>Who should start first?</p>
          <button onClick={() => chooseWhoStarts(true)}>You Start</button>
          <button onClick={() => chooseWhoStarts(false)}>Bot Start</button>
        </div>
      )}

      {playerSymbol && whoStartsChosen && (
        <>
          <div className="ttt-status">
            {!winner && (isPlayerTurn ? 'Your turn' : 'Bot is thinking...')}
          </div>

          <div className="ttt-board">
            {board.map((cell, index) => (
              <div
                key={index}
                className="ttt-cell"
                onClick={() => handleClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>

          {winner && (
            <div className="ttt-winner">
              {winner === 'Draw'
                ? "It's a draw!"
                : winner === playerSymbol
                  ? 'You win!'
                  : 'Bot wins!'}
              <br />
              <button onClick={resetGame}>Play Again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TicTacToe;
