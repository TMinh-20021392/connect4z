import React, { useState, useEffect } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import GameState, { Player } from '../components/gameState';

const SinglePlayer: React.FC = () => {
  // Game state
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  
  // Player configuration
  // When humanIsPlayer1 is true: Human is red (Player 1), AI is yellow (Player 2)
  // When humanIsPlayer1 is false: AI is red (Player 1), Human is yellow (Player 2)
  const [humanIsPlayer1, setHumanIsPlayer1] = useState<boolean>(true);
  
  // Calculate which player number the AI controls (1 or 2 or null for two human players)
  const aiPlayer: Player = humanIsPlayer1 ? 2 : 1;
  
  // Handle turn change
  const handleTurnChange = (player: Player) => {
    setCurrentPlayer(player);
  };
  
  // Handle game end
  const handleGameEnd = (winner: Player) => {
    let resultMessage;
    
    if (winner === null) {
      resultMessage = "It's a draw!";
    } else {
      // Check if human player won based on current configuration
      const humanWon = (humanIsPlayer1 && winner === 1) || (!humanIsPlayer1 && winner === 2);
      resultMessage = humanWon ? "You win! Congratulations!" : "AI wins! Better luck next time.";
    }
    
    setGameResult(resultMessage);
  };
  
  // Reset the game and alternate who goes first
  const resetGame = () => {
    // Clear game result immediately
    setGameResult(null);
    
    // Toggle player assignment
    setHumanIsPlayer1(prev => !prev);
    
    // Reset all state variables including currentPlayer
    setCurrentPlayer(1); // Always reset to Player 1
    
    // Increment reset trigger to force board reset
    // Do this last to ensure all state variables are updated before board resets
    setResetTrigger(prev => prev + 1);
  };
  
  // Get description text based on current player assignment
  const getPlayerDescription = () => {
    if (humanIsPlayer1) {
      return "You play as Red (First)";
    } else {
      return "AI plays as Red (First)";
    }
  };
  
  return (
    <Box className="flex flex-col items-center p-4">
      <Text size="xLarge" className="font-bold mb-6">Single Player Mode</Text>
      
      <Text className="mb-4">
        {getPlayerDescription()}
      </Text>
      
      <Box className="board mb-6">
        <GameState 
          onGameEnd={handleGameEnd}
          onTurnChange={handleTurnChange}
          resetTrigger={resetTrigger}
          aiPlayer={aiPlayer}
          aiDelay={700} // Slightly longer delay for more natural feel
          data-testid="game-state"
        />
      </Box>
      
      {gameResult && (
        <Box className="text-center mb-6">
          <Text size="large" className="font-bold">{gameResult}</Text>
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

export default SinglePlayer;