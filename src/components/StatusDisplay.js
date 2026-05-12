import React from 'react';
import { PLAYER, AI } from '../../utils/constants';

// Displays game status, winner messages, and loading state
export const StatusDisplay = ({ 
  winner, 
  currentPlayer, 
  isAIThinking, 
  onReset 
}) => {
  if (winner) {
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.statusText,
          color: winner === 'draw' ? '#ffff00' : winner === PLAYER ? '#ff00ff' : '#00ffff',
          textShadow: `0 0 10px ${winner === 'draw' ? '#ffff00' : winner === PLAYER ? '#ff00ff' : '#00ffff'}`
        }}>
          {winner === 'draw' ? 'DRAW!' : winner === PLAYER ? 'YOU WIN!' : 'AI WINS!'}
        </div>
        <ResetButton onClick={onReset} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.statusText,
        color: currentPlayer === PLAYER ? '#ff00ff' : '#00ffff',
        textShadow: `0 0 10px ${currentPlayer === PLAYER ? '#ff00ff' : '#00ffff'}`
      }}>
        {isAIThinking ? 'AI THINKING...' : currentPlayer === PLAYER ? 'YOUR TURN' : 'AI TURN'}
      </div>
      {isAIThinking && <LoadingDots />}
    </div>
  );
};

// Reset button component
const ResetButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={styles.button}
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
);

// Animated loading dots for AI thinking state
const LoadingDots = () => (
  <div style={styles.loadingDots}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          ...styles.dot,
          animationDelay: `${i * 0.2}s`
        }}
      />
    ))}
  </div>
);

const styles = {
  container: {
    textAlign: 'center',
    marginBottom: '30px',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: {
    fontSize: '14px',
    animation: 'float 2s ease-in-out infinite'
  },
  button: {
    fontSize: '12px',
    padding: '12px 24px',
    background: 'rgba(255, 0, 255, 0.2)',
    border: '2px solid #ff00ff',
    color: '#ff00ff',
    cursor: 'pointer',
    borderRadius: '8px',
    fontFamily: '"Press Start 2P", monospace',
    textShadow: '0 0 10px #ff00ff',
    transition: 'all 0.2s',
    boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)'
  },
  loadingDots: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  dot: {
    width: '8px',
    height: '8px',
    background: '#00ffff',
    borderRadius: '50%',
    animation: 'float 1s ease-in-out infinite',
    boxShadow: '0 0 10px #00ffff'
  }
};