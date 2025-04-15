
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-wave-purple to-wave-vivid-purple bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-foreground mb-4">Oops! Page not found</p>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/')}
          className="bg-wave-purple hover:bg-wave-purple/90"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
