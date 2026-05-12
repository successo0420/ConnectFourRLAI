// All CSS animations and styles for the game
export const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
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
  `;
  document.head.appendChild(style);
};

// Layout styles
export const layout = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1432 50%, #2d1b3d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Press Start 2P", monospace',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  animatedGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    animation: 'gridScroll 20s linear infinite',
    pointerEvents: 'none'
  },
  gameContainer: {
    background: 'rgba(10, 14, 39, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '3px solid rgba(0, 255, 255, 0.3)',
    padding: '40px',
    boxShadow: '0 0 60px rgba(255, 0, 255, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    zIndex: 1
  },
  scanline: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(transparent 50%, rgba(0, 255, 255, 0.03) 50%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none',
    borderRadius: '20px',
    overflow: 'hidden'
  }
};