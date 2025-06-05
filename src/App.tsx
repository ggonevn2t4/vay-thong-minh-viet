
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
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import LoanComparison from "./pages/LoanComparison";
import FAQ from "./pages/FAQ";
import LoanEligibility from "./pages/LoanEligibility";
import DocumentChecklistPage from "./pages/DocumentChecklistPage";
import Marketplace from "./pages/Marketplace";
import Messages from "./pages/Messages";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/khao-sat" element={<KhaoSat />} />
            <Route path="/so-sanh" element={<SoSanh />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="customer">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/advisor-dashboard" element={
              <ProtectedRoute requiredRole="advisor">
                <AdvisorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/ket-qua" element={
              <ProtectedRoute>
                <KetQua />
              </ProtectedRoute>
            } />
            <Route path="/loan-comparison" element={<LoanComparison />} />
            <Route path="/loan-eligibility" element={<LoanEligibility />} />
            <Route path="/document-checklist" element={<DocumentChecklistPage />} />
            <Route path="/faq" element={<FAQ />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
