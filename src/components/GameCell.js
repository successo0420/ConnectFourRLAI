import React from 'react';
import { PLAYER } from '../../utils/constants';

// Individual game cell component
export const GameCell = ({ 
  cell, 
  onClick, 
  onMouseEnter, 
  onMouseLeave, 
  isWinning, 
  isHovered,
  isEmpty
}) => {
  const isEmptyCell = cell === 0;
  
  return (
    <div
      className={`cell ${!isEmptyCell ? 'piece' : ''} ${isWinning ? 'winning-piece' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...styles.cell,
        background: isHovered 
          ? 'rgba(255, 0, 255, 0.15)'
          : 'rgba(0, 0, 0, 0.4)',
        cursor: isEmpty ? 'pointer' : 'default'
      }}
    >
      {!isEmptyCell && <PieceDisplay cell={cell} />}
    </div>
  );
};

// The visual piece (token) on the board
const PieceDisplay = ({ cell }) => (
  <div style={{
    ...styles.piece,
    background: cell === PLAYER
      ? 'radial-gradient(circle at 30% 30%, #ff00ff, #aa00aa)'
      : 'radial-gradient(circle at 30% 30%, #00ffff, #0088aa)',
    border: `3px solid ${cell === PLAYER ? '#ff00ff' : '#00ffff'}`,
    boxShadow: cell === PLAYER
      ? '0 0 20px #ff00ff, inset 0 -5px 10px rgba(0, 0, 0, 0.3)'
      : '0 0 20px #00ffff, inset 0 -5px 10px rgba(0, 0, 0, 0.3)'
  }}>
    {/* Shine effect */}
    <div style={styles.shine} />
  </div>
);

const styles = {
  cell: {
    width: '70px',
    height: '70px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(0, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.2s ease'
  },
  piece: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    position: 'relative'
  },
  shine: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    width: '15px',
    height: '15px',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '50%',
    filter: 'blur(3px)'
  }
};