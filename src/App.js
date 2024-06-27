import React, { useState, useEffect } from 'react';

const XOGame = () => {
  const [board, setBoard] = useState(Array(25).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState('human'); // 'human' หรือ 'ai'

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    const newBoard = board.slice();
    if (calculateWinner(newBoard) || newBoard[i]) return;
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const aiMove = () => {
    const newBoard = board.slice();
    // ตรวจสอบว่ามีช่องที่ AI สามารถชนะได้ทันทีหรือไม่
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'O';
        if (calculateWinner(newBoard) === 'O') {
          setBoard(newBoard);
          setXIsNext(true);
          return;
        }
        newBoard[i] = null;
      }
    }
    // ตรวจสอบว่ามีช่องที่ต้องป้องกันไม่ให้ผู้เล่นชนะหรือไม่
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'X';
        if (calculateWinner(newBoard) === 'X') {
          newBoard[i] = 'O';
          setBoard(newBoard);
          setXIsNext(true);
          return;
        }
        newBoard[i] = null;
      }
    }
    // ถ้าไม่มีช่องพิเศษ ให้เลือกช่องว่างแบบสุ่ม
    let emptySquares = newBoard.reduce((acc, val, idx) => !val ? acc.concat(idx) : acc, []);
    if (emptySquares.length > 0) {
      let randomIndex = Math.floor(Math.random() * emptySquares.length);
      newBoard[emptySquares[randomIndex]] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
    }
  };

  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext && !calculateWinner(board)) {
      const timer = setTimeout(() => {
        aiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, gameMode]);

  const renderSquare = (i) => {
    return (
      <button className="w-16 h-16 border border-gray-400 flex items-center justify-center text-4xl font-bold" onClick={() => handleClick(i)}>
        {board[i] === 'X' ? '🐱' : board[i] === 'O' ? '🐶' : null}
      </button>
    );
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `ผู้ชนะ: ${winner === 'X' ? '🐱 แมวสีชมพู' : '🐶 หมาสีน้ำตาล'}`;
  } else if (board.every(square => square)) {
    status = 'เสมอ!';
  } else {
    status = `ผู้เล่นต่อไป: ${xIsNext ? '🐱 แมวสีชมพู' : '🐶 หมาสีน้ำตาล'}`;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">{status}</div>
      <div className="grid grid-cols-5 gap-1">
        {Array(25).fill(null).map((_, i) => (
          <React.Fragment key={i}>
            {renderSquare(i)}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          onClick={() => {setGameMode('human'); setBoard(Array(25).fill(null)); setXIsNext(true);}}
        >
          เล่นกับเพื่อน
        </button>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => {setGameMode('ai'); setBoard(Array(25).fill(null)); setXIsNext(true);}}
        >
          เล่นกับ AI
        </button>
      </div>
    </div>
  );
};

export default XOGame;