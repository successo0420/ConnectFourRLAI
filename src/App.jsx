import React, { useState, useEffect } from 'react';

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER = 1;
const AI = 2;

export default function ConnectFour() {
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hoveredCol, setHoveredCol] = useState(null);

  const checkWinner = (board, row, col, player) => {
    const directions = [
      [[0, 1], [0, -1]],   // horizontal
      [[1, 0], [-1, 0]],   // vertical
      [[1, 1], [-1, -1]],  // diagonal \
      [[1, -1], [-1, 1]]   // diagonal /
    ];

    for (let direction of directions) {
      let count = 1;
      let cells = [[row, col]];
      
      for (let [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          count++;
          cells.push([r, c]);
          r += dr;
          c += dc;
        }
      }
      
      if (count >= 4) {
        return cells;
      }
    }
    return null;
  };

  const dropPiece = (col) => {
    if (winner || isAIThinking) return;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === EMPTY) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setLastMove([row, col]);

        const winCells = checkWinner(newBoard, row, col, currentPlayer);
        if (winCells) {
          setWinner(currentPlayer);
          setWinningCells(winCells);
        } else if (newBoard.every(r => r.every(c => c !== EMPTY))) {
          setWinner('draw');
        } else {
          setCurrentPlayer(currentPlayer === PLAYER ? AI : PLAYER);
        }
        return;
      }
    }
  };

  // Simple AI: random valid move (you'll replace this with RL later)
useEffect(() => {
  if (currentPlayer === AI && !winner) {
    setIsAIThinking(true);

    // Call your Python Backend
    fetch('http://localhost:5000/get-move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board: board })
    })
    .then(res => res.json())
    .then(data => {
      dropPiece(data.column);
      setIsAIThinking(false);
    })
    .catch(err => {
      console.error("AI Server not responding", err);
      setIsAIThinking(false);
    });
  }
}, [currentPlayer, winner]);

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
    setCurrentPlayer(PLAYER);
    setWinner(null);
    setWinningCells([]);
    setLastMove(null);
    setIsAIThinking(false);
  };

  const isWinningCell = (row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  const isLastMove = (row, col) => {
    return lastMove && lastMove[0] === row && lastMove[1] === col;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1432 50%, #2d1b3d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Press Start 2P", monospace',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridScroll 20s linear infinite',
        pointerEvents: 'none'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        @keyframes gridScroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 8px currentColor); }
          50% { filter: drop-shadow(0 0 20px currentColor); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pieceEnter {
          0% { transform: translateY(-100px) scale(0.8); opacity: 0; }
          60% { transform: translateY(0) scale(1.1); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes winPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px currentColor); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 30px currentColor); }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .cell {
          transition: background 0.2s ease;
        }

        .cell:hover {
          background: rgba(0, 255, 255, 0.1);
        }

        .piece {
          animation: pieceEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .winning-piece {
          animation: winPulse 1s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '3px solid rgba(0, 255, 255, 0.3)',
        padding: '40px',
        boxShadow: '0 0 60px rgba(255, 0, 255, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Scanline effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(transparent 50%, rgba(0, 255, 255, 0.03) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 40%, rgba(0, 255, 255, 0.2) 50%, transparent 60%)',
            animation: 'scanline 8s linear infinite'
          }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          textAlign: 'center',
          marginBottom: '30px',
          color: '#00ffff',
          textShadow: '0 0 20px #00ffff, 0 0 40px #ff00ff',
          letterSpacing: '4px',
          animation: 'glow 2s ease-in-out infinite'
        }}>
          CONNECT-4
        </h1>

        {/* Status Display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {winner ? (
            <>
              <div style={{
                fontSize: '16px',
                color: winner === 'draw' ? '#ffff00' : winner === PLAYER ? '#ff00ff' : '#00ffff',
                textShadow: `0 0 10px ${winner === 'draw' ? '#ffff00' : winner === PLAYER ? '#ff00ff' : '#00ffff'}`,
                animation: 'float 2s ease-in-out infinite'
              }}>
                {winner === 'draw' ? 'DRAW!' : winner === PLAYER ? 'YOU WIN!' : 'AI WINS!'}
              </div>
              <button
                onClick={resetGame}
                style={{
                  fontSize: '12px',
                  padding: '12px 24px',
                  background: 'rgba(255, 0, 255, 0.2)',
                  border: '2px solid #ff00ff',
                  color: '#ff00ff',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  textShadow: '0 0 10px #ff00ff',
                  transition: 'all 0.2s',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 0, 255, 0.4)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 0, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                PLAY AGAIN
              </button>
            </>
          ) : (
            <>
              <div style={{
                fontSize: '14px',
                color: currentPlayer === PLAYER ? '#ff00ff' : '#00ffff',
                textShadow: `0 0 10px ${currentPlayer === PLAYER ? '#ff00ff' : '#00ffff'}`
              }}>
                {isAIThinking ? 'AI THINKING...' : currentPlayer === PLAYER ? 'YOUR TURN' : 'AI TURN'}
              </div>
              {isAIThinking && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#00ffff',
                        borderRadius: '50%',
                        animation: `float 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                        boxShadow: '0 0 10px #00ffff'
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Game Board */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(0, 0, 0, 0.6)',
          padding: '20px',
          borderRadius: '16px',
          border: '3px solid rgba(0, 255, 255, 0.4)',
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 70px)`,
            gap: '8px'
          }}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="cell"
                  onClick={() => currentPlayer === PLAYER && !winner && dropPiece(colIndex)}
                  onMouseEnter={() => setHoveredCol(colIndex)}
                  onMouseLeave={() => setHoveredCol(null)}
                  style={{
                    width: '70px',
                    height: '70px',
                    background: hoveredCol === colIndex && rowIndex === 0 && currentPlayer === PLAYER && !winner
                      ? 'rgba(255, 0, 255, 0.15)'
                      : 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentPlayer === PLAYER && !winner && board[0][colIndex] === EMPTY ? 'pointer' : 'default',
                    border: '2px solid rgba(0, 255, 255, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {cell !== EMPTY && (
                    <div
                      className={`piece ${isWinningCell(rowIndex, colIndex) ? 'winning-piece' : ''}`}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: cell === PLAYER
                          ? 'radial-gradient(circle at 30% 30%, #ff00ff, #aa00aa)'
                          : 'radial-gradient(circle at 30% 30%, #00ffff, #0088aa)',
                        border: `3px solid ${cell === PLAYER ? '#ff00ff' : '#00ffff'}`,
                        boxShadow: cell === PLAYER
                          ? '0 0 20px #ff00ff, inset 0 -5px 10px rgba(0, 0, 0, 0.3)'
                          : '0 0 20px #00ffff, inset 0 -5px 10px rgba(0, 0, 0, 0.3)',
                        position: 'relative'
                      }}
                    >
                      {/* Shine effect */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        width: '15px',
                        height: '15px',
                        background: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: '50%',
                        filter: 'blur(3px)'
                      }} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info text */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          fontSize: '10px',
          color: 'rgba(0, 255, 255, 0.5)',
          letterSpacing: '1px'
        }}>
          AI USES RANDOM MOVES • READY FOR RL TRAINING
        </div>
      </div>
    </div>
  );
}