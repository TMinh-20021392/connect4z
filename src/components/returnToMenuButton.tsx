import React from 'react';
import { Button, useNavigate } from 'zmp-ui';

interface ReturnToMenuButtonProps {
  resetGame?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const ReturnToMenuButton: React.FC<ReturnToMenuButtonProps> = ({ 
  resetGame, 
  variant = 'secondary',
  className = '' 
}) => {
  const navigate = useNavigate();
  
  const returnToMenu = () => {
    if (resetGame) {
      resetGame();
    }
    navigate('/');
  };
  
  return (
    <Button 
      variant={variant} 
      onClick={returnToMenu}
      fullWidth
      className={className}
      data-testid="return-to-menu-button"
    >
      Return to Menu
    </Button>
  );
};

export default ReturnToMenuButton;