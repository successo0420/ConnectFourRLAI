import React, { useState } from 'react';
import { COLS } from '../../utils/constants';
import { GameCell } from './GameCell';

// The main game board component
export const GameBoard = ({ 
  board, 
  onCellClick, 
  isWinningCell, 
  isValidMove 
}) => {
  const [hoveredCol, setHoveredCol] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              isWinning={isWinningCell(rowIndex, colIndex)}
              isHovered={hoveredCol === colIndex && rowIndex === 0}
              isEmpty={isValidMove(colIndex)}
              onClick={() => onCellClick(colIndex)}
              onMouseEnter={() => setHoveredCol(colIndex)}
              onMouseLeave={() => setHoveredCol(null)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'inline-block',
    background: 'rgba(0, 0, 0, 0.6)',
    padding: '20px',
    borderRadius: '16px',
    border: '3px solid rgba(0, 255, 255, 0.4)',
    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${COLS}, 70px)`,
    gap: '8px'
  }
};