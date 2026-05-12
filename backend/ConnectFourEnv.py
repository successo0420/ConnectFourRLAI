import numpy as np
from typing import Tuple, Optional, List

class ConnectFourEnv:
    """Connect Four environment for reinforcement learning."""
    
    def __init__(self):
        self.rows = 6
        self.cols = 7
        self.board = None
        self.current_player = 1
        self.reset()
    
    def reset(self) -> np.ndarray:
        """Reset the game to initial state."""
        self.board = np.zeros((self.rows, self.cols), dtype=int)
        self.current_player = 1
        return self.board.copy()
    
    def get_valid_moves(self) -> List[int]:
        """Return list of valid column indices."""
        return [col for col in range(self.cols) if self.board[0][col] == 0]
    
    def make_move(self, col: int) -> Tuple[np.ndarray, float, bool, dict]:
        """
        Make a move in the specified column.
        
        Returns:
            state: New board state
            reward: Reward for this move
            done: Whether game is over
            info: Additional information
        """
        if col not in self.get_valid_moves():
            # Invalid move - heavily penalize
            return self.board.copy(), -10.0, True, {"invalid_move": True}
        
        # Find the lowest empty row in this column
        row = self._get_next_row(col)
        self.board[row][col] = self.current_player
        
        # Check for win
        if self._check_win(row, col, self.current_player):
            reward = 1.0  # Win reward
            done = True
            info = {"winner": self.current_player}
        # Check for draw
        elif len(self.get_valid_moves()) == 0:
            reward = 0.0  # Draw
            done = True
            info = {"draw": True}
        else:
            # Game continues - small penalty for not winning yet
            reward = 0.0
            done = False
            info = {}
        
        # Switch player
        self.current_player = 3 - self.current_player  # Switch between 1 and 2
        
        return self.board.copy(), reward, done, info
    
    def _get_next_row(self, col: int) -> int:
        """Get the next available row in a column."""
        for row in range(self.rows - 1, -1, -1):
            if self.board[row][col] == 0:
                return row
        return -1
    
    def _check_win(self, row: int, col: int, player: int) -> bool:
        """Check if the last move resulted in a win."""
        # Check all four directions: horizontal, vertical, diagonal /, diagonal \
        directions = [
            [(0, 1), (0, -1)],   # horizontal
            [(1, 0), (-1, 0)],   # vertical
            [(1, 1), (-1, -1)],  # diagonal \
            [(1, -1), (-1, 1)]   # diagonal /
        ]
        
        for direction in directions:
            count = 1  # Count the piece we just placed
            
            # Check both directions
            for dr, dc in direction:
                r, c = row + dr, col + dc
                while 0 <= r < self.rows and 0 <= c < self.cols and self.board[r][c] == player:
                    count += 1
                    r += dr
                    c += dc
            
            if count >= 4:
                return True
        
        return False
    
    def get_state_representation(self) -> np.ndarray:
        """
        Get a representation of the board suitable for neural network input.
        Returns a 3D array: (3, rows, cols) where:
        - Channel 0: Current player's pieces
        - Channel 1: Opponent's pieces  
        - Channel 2: Empty spaces
        """
        state = np.zeros((3, self.rows, self.cols), dtype=np.float32)
        state[0] = (self.board == self.current_player).astype(np.float32)
        state[1] = (self.board == (3 - self.current_player)).astype(np.float32)
        state[2] = (self.board == 0).astype(np.float32)
        return state
    
    def render(self):
        """Print the board to console."""
        symbols = {0: '⚫', 1: '🔴', 2: '🔵'}
        print("\n" + "  ".join(map(str, range(self.cols))))
        for row in self.board:
            print("  ".join(symbols[cell] for cell in row))
        print()