import React, { useState, useEffect } from 'react';
import { Box, Text } from 'zmp-ui';

// Define types for our game board
type Player = 1 | 2 | null;
type BoardState = Player[][];

interface GameStateProps {
  onGameEnd?: (winner: Player) => void;
  resetTrigger?: number;
}

const GameState: React.FC<GameStateProps> = ({ onGameEnd, resetTrigger = 0 }) => {
  const ROWS = 6;
  const COLS = 7;
  
  // Initialize empty board
  const createEmptyBoard = (): BoardState => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player>(null);
  
  // Reset the game when resetTrigger changes
  useEffect(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
  }, [resetTrigger]);
  
  // Check if there's a winner after each move
  useEffect(() => {
    const checkWinner = () => {
      // Check horizontal
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          if (
            board[r][c] !== null &&
            board[r][c] === board[r][c + 1] &&
            board[r][c] === board[r][c + 2] &&
            board[r][c] === board[r][c + 3]
          ) {
            return board[r][c];
          }
        }
      }
      
      // Check vertical
      for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c < COLS; c++) {
          if (
            board[r][c] !== null &&
            board[r][c] === board[r + 1][c] &&
            board[r][c] === board[r + 2][c] &&
            board[r][c] === board[r + 3][c]
          ) {
            return board[r][c];
          }
        }
      }
      
      // Check diagonal (down-right)
      for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          if (
            board[r][c] !== null &&
            board[r][c] === board[r + 1][c + 1] &&
            board[r][c] === board[r + 2][c + 2] &&
            board[r][c] === board[r + 3][c + 3]
          ) {
            return board[r][c];
          }
        }
      }
      
      // Check diagonal (up-right)
      for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          if (
            board[r][c] !== null &&
            board[r][c] === board[r - 1][c + 1] &&
            board[r][c] === board[r - 2][c + 2] &&
            board[r][c] === board[r - 3][c + 3]
          ) {
            return board[r][c];
          }
        }
      }
      
      // Check if board is full (draw)
      const isFull = board.every(row => row.every(cell => cell !== null));
      if (isFull) {
        return 0; // Draw
      }
      
      return null; // No winner yet
    };
    
    const gameWinner = checkWinner();
    if (gameWinner !== null) {
      setGameOver(true);
      setWinner(gameWinner === 0 ? null : gameWinner);
      if (onGameEnd) {
        onGameEnd(gameWinner === 0 ? null : gameWinner);
      }
    }
  }, [board, onGameEnd]);
  
  // Make a move in the selected column
  const dropDisc = (col: number) => {
    if (gameOver) return;
    
    // Find the first empty cell from bottom to top
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        return;
      }
    }
  };
  
  return (
    <Box className="flex flex-col items-center">
      {/* Game status */}
      <Text size="large" className="mb-4 font-bold">
        {gameOver 
          ? winner 
            ? `Player ${winner} wins!` 
            : "It's a draw!" 
          : `Player ${currentPlayer}'s turn`}
      </Text>
      
      {/* Board */}
      <Box className="bg-blue-600 p-2 rounded-lg">
        {board.map((row, rowIndex) => (
          <Box key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Box 
                key={`${rowIndex}-${colIndex}`}
                className="w-10 h-10 bg-blue-800 m-1 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => dropDisc(colIndex)}
              >
                {cell && (
                  <Box 
                    className={`w-8 h-8 rounded-full ${
                      cell === 1 ? 'bg-red-500' : 'bg-yellow-400'
                    }`}
                  />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GameState;