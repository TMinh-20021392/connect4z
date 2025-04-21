import React, { useState } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import GameState, { Player } from '../components/gameState';

const TwoPlayer: React.FC = () => {
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);

  // Handle turn change
  const handleTurnChange = (player: Player) => {
    setCurrentPlayer(player);
  };

  // Handle game end
  const handleGameEnd = (winner: Player) => {
    if (winner === null) {
      setGameResult("It's a draw!");
    } else {
      setGameResult(`Player ${winner} wins!`);
    }
  };

  // Reset the game
  const resetGame = () => {
    setGameResult(null);
    setCurrentPlayer(1); // Always reset to Player 1
    setResetTrigger(prev => prev + 1); // Increment reset trigger to reset the board
  };

  return (
    <Box className="flex flex-col items-center p-4">
      <Text size="xLarge" className="font-bold mb-6">Two Player Mode</Text>

      <Text className="mb-4">
        {gameResult ? gameResult : `Player ${currentPlayer}'s turn`}
      </Text>

      <Box className="board mb-6">
        <GameState
          onGameEnd={handleGameEnd}
          onTurnChange={handleTurnChange}
          resetTrigger={resetTrigger}
          aiPlayer={null} // No AI in two-player mode
          data-testid="game-state"
        />
      </Box>

      {gameResult && (
        <Box className="text-center mb-6">
          <Button
            variant="primary"
            className="mt-4"
            onClick={resetGame}
          >
            Play Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TwoPlayer;