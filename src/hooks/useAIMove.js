import { useState, useEffect, useRef } from 'react';
import { AI } from '../utils/constants';

// Custom hook for handling AI moves via backend
export const useAIMove = (currentPlayer, winner, board, dropPiece) => {
  const [isAIThinking, setIsAIThinking] = useState(false);
  const thinkingRef = useRef(false);

  useEffect(() => {
    // Only proceed if it's AI's turn and game isn't over
    if (currentPlayer !== AI || winner || thinkingRef.current) return;
    
    // Prevent duplicate calls
    thinkingRef.current = true;
    setIsAIThinking(true);

    const fetchAIMove = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ board: board, player: currentPlayer })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate the AI's move
        if (data.column >= 0 && data.column < 7) {
          dropPiece(data.column);
        } else {
          console.error("Invalid column returned from AI:", data.column);
        }
      } catch (err) {
        console.error("AI Server not responding:", err);
        
        // Optional: implement fallback random move here
        // const validMoves = board[0].map((_, col) => col).filter(col => findEmptyRow(board, col) !== -1);
        // if (validMoves.length > 0) {
        //   dropPiece(validMoves[Math.floor(Math.random() * validMoves.length)]);
        // }
      } finally {
        setIsAIThinking(false);
        thinkingRef.current = false;
      }
    };

    fetchAIMove();
  }, [currentPlayer, winner, board, dropPiece]);

  return isAIThinking;
};