
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SearchPage from "./pages/Search";
import LibraryPage from "./pages/Library";
import LikedSongsPage from "./pages/LikedSongs";
import NotFound from "./pages/NotFound";
import { useSpotifyAuth } from "./hooks/use-spotify-auth";

const queryClient = new QueryClient();

// Create a wrapper for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useSpotifyAuth();
  
  if (loading) {
    // Show loading state while checking auth
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      } />
      <Route path="/library" element={
        <ProtectedRoute>
          <LibraryPage />
        </ProtectedRoute>
      } />
      <Route path="/liked-songs" element={
        <ProtectedRoute>
          <LikedSongsPage />
        </ProtectedRoute>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;