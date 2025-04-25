import React, { ReactNode } from 'react';
import { Box, Text } from 'zmp-ui';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  subtitle?: string | ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <Box className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Top spacer for vertical centering */}
      <Box className="flex-grow" />
      
      {/* Game content - will be centered vertically */}
      <Box className="flex flex-col items-center">
        <Text size="xLarge" className="font-bold text-center">{title}</Text>
        
        {subtitle && (
          typeof subtitle === 'string' 
            ? <Text className="mb-4">{subtitle}</Text>
            : subtitle
        )}
        
        {children}
      </Box>
      
      {/* Bottom spacer for vertical centering */}
      <Box className="flex-grow" />
    </Box>
  );
};

export default PageLayout;