
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import KhaoSat from "./pages/KhaoSat";
import SoSanh from "./pages/SoSanh";
import KetQua from "./pages/KetQua";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <ClerkLoading>
            <div className="flex items-center justify-center min-h-screen">
              Đang tải...
            </div>
          </ClerkLoading>
          
          <ClerkLoaded>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/khao-sat" element={
                <ProtectedRoute>
                  <KhaoSat />
                </ProtectedRoute>
              } />
              <Route path="/so-sanh" element={<SoSanh />} />
              <Route path="/ket-qua" element={
                <ProtectedRoute>
                  <KetQua />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ClerkLoaded>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
