import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';
import ReturnToMenuButton from '../components/returnToMenuButton';

const HowToPlay: React.FC = () => {
  return (
    <Box className="p-4 flex flex-col min-h-screen">
      <Text size="xLarge" className="font-bold mb-6 text-center">How to Play</Text>
      
      <Box className="bg-white rounded-lg p-4 shadow-md mb-6">
        <Text size="large" className="font-bold mb-2">Game Objective</Text>
        <Text className="mb-4">
          Connect Four is a two-player game where the objective is to be the first to form a horizontal, 
          vertical, or diagonal line of four of your own discs.
        </Text>
        
        <Text size="large" className="font-bold mb-2">Game Rules</Text>
        <Box className="ml-4 mb-4">
          <Box className="flex mb-2">
            <Icon icon="zi-chevron-right" className="mr-2 mt-1" />
            <Text>Players take turns dropping colored discs into a 7-column, 6-row grid. Red always goes first, and yellow goes second. </Text>
          </Box>
          <Box className="flex mb-2">
            <Icon icon="zi-chevron-right" className="mr-2 mt-1" />
            <Text>Discs fall to the lowest available position in the chosen column.</Text>
          </Box>
          <Box className="flex mb-2">
            <Icon icon="zi-chevron-right" className="mr-2 mt-1" />
            <Text>The first player to connect four discs in a row (horizontally, vertically, or diagonally) wins.</Text>
          </Box>
          <Box className="flex mb-2">
            <Icon icon="zi-chevron-right" className="mr-2 mt-1" />
            <Text>If the grid fills up without a winner, the game is a draw.</Text>
          </Box>
        </Box>
      </Box>
      
      <Box className="bg-white rounded-lg p-4 shadow-md mb-6">
        <Text size="large" className="font-bold mb-2">Game Modes</Text>
        
        <Text className="font-bold mb-1">Single Player</Text>
        <Text className="mb-3">
          Challenge the AI in single-player mode. You start as red in the first game, then roles alternate with each rematch.
        </Text>

        
        <Text className="font-bold mb-1">Two Player (Coming Soon)</Text>
        <Text className="mb-3">
          Play against a friend on the same device. Take turns dropping discs into the grid.
        </Text>
      </Box>
      
      <Box className="bg-white rounded-lg p-4 shadow-md mb-6">
        <Text size="large" className="font-bold mb-2">Tips</Text>
        <Box className="ml-4">
          <Box className="flex mb-2">
            <Icon icon="zi-chevron-right" className="mr-2 mt-1" />
            <Text>Try to control the center columns as they provide more winning opportunities.</Text>
          </Box>
          <Box className="flex mb-2">
            <Icon icon="zi-chevron-right" className="mr-2 mt-1" />
            <Text>Watch for your opponent's potential winning moves to block them.</Text>
          </Box>
          <Box className="flex mb-2">
            <Icon icon="zi-chevron-right" className="mr-2 mt-1" />
            <Text>Look for opportunities to create "double threats" that force your opponent to block one line while you complete another.</Text>
          </Box>
        </Box>
      </Box>

      <Box className="mt-auto flex justify-center mb-6">
        <ReturnToMenuButton />
      </Box>
    </Box>
  );
};

export default HowToPlay;