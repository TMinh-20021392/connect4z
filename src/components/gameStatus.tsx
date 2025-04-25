import React, { ReactNode } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import ReturnToMenuButton from './returnToMenuButton';

interface GameStatusProps {
  isGameOver: boolean;
  resultMessage?: string | null;
  onPlayAgain?: () => void;
  resetGame?: () => void;
  children?: ReactNode;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  isGameOver, 
  resultMessage, 
  onPlayAgain, 
  resetGame,
  children
}) => {
  return (
    <Box className="h-24 flex flex-col items-center justify-center mt-6">
      {isGameOver && resultMessage ? (
        <Text size="large" className="font-bold mb-2">{resultMessage}</Text>
      ) : (
        <Box className="h-8">{children}</Box>
      )}
      
      {/* Button container - always the same height */}
      <Box className="flex flex-col gap-2 w-full">
        {isGameOver ? (
          <>
            <Button 
              variant="primary"
              onClick={onPlayAgain || resetGame}
              fullWidth
              data-testid="play-again-button"
            >
              Play Again
            </Button>
            <ReturnToMenuButton resetGame={resetGame} />
          </>
        ) : (
          <ReturnToMenuButton resetGame={resetGame} />
        )}
      </Box>
    </Box>
  );
};

export default GameStatus;