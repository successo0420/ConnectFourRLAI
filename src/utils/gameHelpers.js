import { ROWS, COLS, EMPTY } from './constants';

// Check for a winner starting from a specific position
export const checkWinner = (board, row, col, player, winConditions) => {
  for (let direction of winConditions) {
    let count = 1;
    let cells = [[row, col]];
    
    for (let [dr, dc] of direction) {
      let r = row + dr;
      let c = col + dc;
      
      while (
        r >= 0 && r < ROWS && 
        c >= 0 && c < COLS && 
        board[r][c] === player
      ) {
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

// Find the lowest empty row in a column
export const findEmptyRow = (board, col) => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === EMPTY) {
      return row;
    }
  }
  return -1; // Column is full
};

// Check if the board is completely full
export const isBoardFull = (board) => {
  return board.every(row => row.every(cell => cell !== EMPTY));
};

// Create an empty board
export const createEmptyBoard = () => {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
};

// Make a deep copy of the board
export const copyBoard = (board) => {
  return board.map(row => [...row]);
};