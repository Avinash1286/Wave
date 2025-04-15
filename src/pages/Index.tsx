import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { isAuthenticated } from '@/utils/auth';
import RoomsList from '@/components/rooms/RoomsList';

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        const newOpacity = 1 - (scrollPosition / heroHeight);
        setOpacity(Math.max(0, newOpacity));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show auth modal if redirected from a protected route
  useEffect(() => {
    const from = location.state?.from;
    if (from && !isAuthenticated()) {
      setAuthModalOpen(true);
    }
  }, [location]);

  // Redirect back to protected route after login
  useEffect(() => {
    const from = location.state?.from;
    if (from && isAuthenticated()) {
      navigate(from.pathname);
    }
  }, [location, navigate]);

  return (
    <Layout>
      {isAuthenticated() ? (
        <div className="space-y-12">
          <div 
            ref={heroRef}
            className="relative min-h-[60vh] flex items-center justify-center overflow-hidden rounded-2xl mx-4"
            style={{
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/banner.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div 
              className="text-center px-4 py-16 relative z-10"
              style={{ opacity }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Welcome to Wave
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join live audio conversations, connect with friends, and explore new topics in real-time. 
                Experience the future of social audio.
              </p>
            </div>
          </div>
          
          <div className="space-y-6 px-4">
         
            <RoomsList />
          </div>
        </div>
      ) : (

        <div className="space-y-12">
          <div 
            ref={heroRef}
            className="relative min-h-[60vh] flex items-center justify-center overflow-hidden rounded-2xl mx-4"
            style={{
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/banner.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
           

        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Welcome to Wave
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join live audio conversations, connect with friends, and explore new topics in real-time. 
                Experience the future of social audio.
              </p>
          
          <div className="flex gap-4">
            <Button size="lg" onClick={() => setAuthModalOpen(true)}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => setAuthModalOpen(true)}>
              Sign In
            </Button>
          </div>

          <AuthModal 
            open={authModalOpen} 
            onOpenChange={setAuthModalOpen}
            defaultTab={location.state?.from ? 'login' : 'signup'}
          />
        </div>
          </div>
     
        </div>
        
      )}
    </Layout>
  );
};

export default Index;
