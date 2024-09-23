import { useState } from 'react';

function Kwadrat({ value, onKwadratClick, isWinningkwadrat }) {
  return (
    <button
      className="Kwadrat"
      onClick={onKwadratClick}
      style={{ backgroundColor: isWinningkwadrat ? 'green' : 'white' }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, kwadraty, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(kwadraty).winner || kwadraty[i]) {
      return;
    }
    const nextkwadraty = kwadraty.slice();
    if (xIsNext) {
      nextkwadraty[i] = 'X';
    } else {
      nextkwadraty[i] = 'O';
    }
    onPlay(nextkwadraty);
  }

  const { winner, winningLine } = calculateWinner(kwadraty);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function renderkwadrat(i) {
    const isWinningkwadrat = winningLine && winningLine.includes(i);
    return (
      <Kwadrat
        value={kwadraty[i]}
        onKwadratClick={() => handleClick(i)}
        isWinningkwadrat={isWinningkwadrat}
      />
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderkwadrat(0)}
        {renderkwadrat(1)}
        {renderkwadrat(2)}
      </div>
      <div className="board-row">
        {renderkwadrat(3)}
        {renderkwadrat(4)}
        {renderkwadrat(5)}
      </div>
      <div className="board-row">
        {renderkwadrat(6)}
        {renderkwadrat(7)}
        {renderkwadrat(8)}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentkwadraty = history[currentMove];

  function handlePlay(nextkwadraty) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextkwadraty];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((kwadraty, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} kwadraty={currentkwadraty} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(kwadraty) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (kwadraty[a] && kwadraty[a] === kwadraty[b] && kwadraty[a] === kwadraty[c]) {
      return { winner: kwadraty[a], winningLine: lines[i] };
    }
  }
  return { winner: null, winningLine: null };
}
