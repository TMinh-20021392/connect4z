// src/components/GameBoard.tsx
import React from 'react';
import { Box, Text } from 'zmp-ui';
import { useGame } from '../contexts/gameContext';

interface GameBoardProps {
  'data-testid'?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ 'data-testid': dataTestId }) => {
  const { gameState, makeMove } = useGame();
  const { board, currentPlayer, isGameOver, winner, isDraw, isAIThinking } = gameState;
  
  const getGameStatus = () => {
    if (isGameOver) {
      if (isDraw) return "It's a draw!";
      if (winner) return `Player ${winner} wins!`;
    }
    
    if (isAIThinking) return "AI is thinking...";
    return `Player ${currentPlayer}'s turn`;
  };
  
  // Determine if a player can make a move in a column
  const canMakeMove = (col: number): boolean => {
    // Get top cell of column - if null, column isn't full
    return !isGameOver && !isAIThinking && board[0][col] === null;
  };
  
  return (
    <Box className="flex flex-col items-center" data-testid={dataTestId}>
      {/* Game status */}
      <Text size="large" className="mb-4 font-bold">
        {getGameStatus()}
      </Text>
      
      {/* Board */}
      <Box className="bg-blue-600 p-2 rounded-lg">
        {board.map((row, rowIndex) => (
          <Box key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Box 
                key={`${rowIndex}-${colIndex}`}
                className="w-10 h-10 bg-blue-800 m-1 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (canMakeMove(colIndex)) {
                    makeMove(colIndex);
                  }
                }}
                role="button"
                aria-label={`Column ${colIndex + 1}`}
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

export default GameBoard;