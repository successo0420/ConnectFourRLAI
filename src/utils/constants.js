// Game configuration constants
export const ROWS = 6;
export const COLS = 7;
export const EMPTY = 0;
export const PLAYER = 1;
export const AI = 2;

export const WIN_CONDITIONS = [
  [[0, 1], [0, -1]],   // horizontal
  [[1, 0], [-1, 0]],   // vertical
  [[1, 1], [-1, -1]],  // diagonal \
  [[1, -1], [-1, 1]]   // diagonal /
];