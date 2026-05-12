import { useState, useCallback } from 'react';
import { PLAYER, AI, WIN_CONDITIONS } from '../utils/constants';
import { 
  checkWinner, 
  findEmptyRow, 
  isBoardFull, 
  createEmptyBoard,
  copyBoard 
} from '../utils/gameHelpers';

// Custom hook that manages all game state and logic
export const useGameLogic = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [lastMove, setLastMove] = useState(null);

  // Drop a piece in the specified column
  const dropPiece = useCallback((col) => {
    if (winner) return false; // Game is over

    const row = findEmptyRow(board, col);
    if (row === -1) return false; // Column is full

    const newBoard = copyBoard(board);
    newBoard[row][col] = currentPlayer;
    
    setBoard(newBoard);
    setLastMove([row, col]);

    // Check for winner
    const winCells = checkWinner(newBoard, row, col, currentPlayer, WIN_CONDITIONS);
    if (winCells) {
      setWinner(currentPlayer);
      setWinningCells(winCells);
    } else if (isBoardFull(newBoard)) {
      setWinner('draw');
    } else {
      // Switch turns
      setCurrentPlayer(prev => prev === PLAYER ? AI : PLAYER);
    }
    
    return true; // Move was successful
  }, [board, currentPlayer, winner]);

  // Reset the game to initial state
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER);
    setWinner(null);
    setWinningCells([]);
    setLastMove(null);
  }, []);

  // Check if a cell is part of the winning combination
  const isWinningCell = useCallback((row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  }, [winningCells]);

  // Check if a cell contains the last move
  const isLastMove = useCallback((row, col) => {
    return lastMove && lastMove[0] === row && lastMove[1] === col;
  }, [lastMove]);

  // Check if a move is valid
  const isValidMove = useCallback((col) => {
    return !winner && findEmptyRow(board, col) !== -1 && currentPlayer === PLAYER;
  }, [board, currentPlayer, winner]);

  return {
    board,
    currentPlayer,
    winner,
    dropPiece,
    resetGame,
    isWinningCell,
    isLastMove,
    isValidMove
  };
};