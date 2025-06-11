
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import LoanEligibility from "./pages/LoanEligibility";
import SoSanh from "./pages/SoSanh";
import Marketplace from "./pages/Marketplace";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import Messages from "./pages/Messages";
import KhaoSat from "./pages/KhaoSat";
import KetQua from "./pages/KetQua";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import AboutUs from "./pages/AboutUs";
import LoanComparison from "./pages/LoanComparison";
import AIAdvisory from "./pages/AIAdvisory";
import DocumentChecklistPage from "./pages/DocumentChecklistPage";
import Auth from "./pages/Auth";
import LoanOptimization from "./pages/LoanOptimization";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kiem-tra-dieu-kien" element={<LoanEligibility />} />
            <Route path="/so-sanh" element={<SoSanh />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/advisor" element={<AdvisorDashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/khao-sat" element={<KhaoSat />} />
            <Route path="/ket-qua" element={<KetQua />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/gioi-thieu" element={<AboutUs />} />
            <Route path="/so-sanh-vay" element={<LoanComparison />} />
            <Route path="/tu-van-ai" element={<AIAdvisory />} />
            <Route path="/ho-so-tai-lieu" element={<DocumentChecklistPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/toi-uu-hoa-vay" element={<LoanOptimization />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
