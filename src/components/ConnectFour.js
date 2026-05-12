import React, { useEffect } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useAIMove } from '../../hooks/useAIMove';
import { injectGlobalStyles, layout } from '../../styles/connectFour';
import { Title } from './Title';
import { StatusDisplay } from './StatusDisplay';
import { GameBoard } from './GameBoard';
import { InfoText } from './InfoText';

// Main ConnectFour component that composes all pieces together
export default function ConnectFour() {
  // Initialize game logic
  const {
    board,
    currentPlayer,
    winner,
    dropPiece,
    resetGame,
    isWinningCell,
    isLastMove,
    isValidMove
  } = useGameLogic();

  // Initialize AI player
  const isAIThinking = useAIMove(currentPlayer, winner, board, dropPiece);

  // Inject global styles on mount
  useEffect(() => {
    injectGlobalStyles();
  }, []);

  return (
    <div style={layout.container}>
      {/* Animated background grid */}
      <div style={layout.animatedGrid} />

      {/* Main game container */}
      <div style={layout.gameContainer}>
        {/* Scanline effect container */}
        <div style={layout.scanline}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 40%, rgba(0, 255, 255, 0.2) 50%, transparent 60%)',
            animation: 'scanline 8s linear infinite'
          }} />
        </div>

        <Title />
        
        <StatusDisplay
          winner={winner}
          currentPlayer={currentPlayer}
          isAIThinking={isAIThinking}
          onReset={resetGame}
        />

        <GameBoard
          board={board}
          onCellClick={dropPiece}
          isWinningCell={isWinningCell}
          isValidMove={isValidMove}
        />

        <InfoText />
      </div>
    </div>
  );
}