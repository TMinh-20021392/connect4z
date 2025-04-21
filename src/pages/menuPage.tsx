import React from 'react';
import { Box, Button, Text, useNavigate } from 'zmp-ui';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box className="flex flex-col items-center justify-center min-h-screen p-4">
      <Text size="xLarge" className="font-bold mb-2 text-center text-blue-600">Connect4Z</Text>
      <Text className="mb-8 text-center">Connect four discs to win!</Text>
      
      <Box className="space-y-4 w-full max-w-xs">
        <Button 
          variant="primary" 
          fullWidth
          className="h-12"
          onClick={() => navigate('/single-player')}
        >
          Single Player
        </Button>
        
        <Button 
          variant="secondary" 
          fullWidth
          className="h-12"
          disabled
        >
          Two Player (Coming Soon)
        </Button>
        
        <Button 
          variant="secondary" 
          fullWidth
          className="h-12"
          onClick={() => navigate('/how-to-play')}
        >
          How to Play
        </Button>
      </Box>
      
      <Text className="mt-12 text-xs text-gray-500">
        © {new Date().getFullYear()} Connect4Z - All Rights Reserved
      </Text>
    </Box>
  );
};

export default MenuPage;