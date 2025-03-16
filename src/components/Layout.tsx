
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import AnimatedBackground from './AnimatedBackground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpotifyAuth } from '@/hooks/use-spotify-auth';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { token, loading, initialized, logout } = useSpotifyAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we've completed the auth initialization process
    // and we're not already on the login page
    if (!loading && initialized && !token && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [token, loading, initialized, navigate, location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="flex min-h-screen relative z-10">
        {/* Mobile menu toggle */}
        {isMobile && (
          <button 
            className="fixed top-4 left-4 z-50 p-2 glass-effect rounded-full"
            onClick={toggleSidebar}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white"
            >
              {sidebarOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        )}
        
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onLogout={logout}
        />
        
        {/* Main content */}
        <main className={`flex-1 overflow-y-auto pb-24 transition-all duration-300 ${!isMobile ? 'ml-64' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
