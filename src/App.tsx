
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Messages from "./pages/Messages";
import Groups from "./pages/Groups";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            } />
            <Route path="/profile" element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            } />
            <Route path="/friends" element={
              <AuthenticatedRoute>
                <Friends />
              </AuthenticatedRoute>
            } />
            <Route path="/messages" element={
              <AuthenticatedRoute>
                <Messages />
              </AuthenticatedRoute>
            } />
            <Route path="/groups" element={
              <AuthenticatedRoute>
                <Groups />
              </AuthenticatedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
