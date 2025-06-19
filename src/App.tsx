
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Marketplace from "./pages/Marketplace";
import AdvisorDirectoryPage from "./pages/AdvisorDirectory";
import AdvisorProfile from "./pages/AdvisorProfile";
import AdvisorProfileDetailPage from "./pages/AdvisorProfileDetail";
import Messages from "./pages/Messages";
import LoanComparison from "./pages/LoanComparison";
import LoanOptimization from "./pages/LoanOptimization";
import LoanEligibility from "./pages/LoanEligibility";
import AIAdvisory from "./pages/AIAdvisory";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import DocumentChecklistPage from "./pages/DocumentChecklistPage";
import KhaoSat from "./pages/KhaoSat";
import KetQua from "./pages/KetQua";
import SoSanh from "./pages/SoSanh";
import Settings from "./pages/Settings";
import KnowledgeManagement from "./pages/KnowledgeManagement";
import UserManagement from "./pages/UserManagement";
import SystemAnalytics from "./pages/SystemAnalytics";
import RoleBasedDashboard from "@/components/dashboard/RoleBasedDashboard";
import FinancialGuidesPage from "./pages/FinancialGuides";
import WalletPage from "./pages/Wallet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<RoleBasedDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
              <Route path="/advisor-profile" element={<AdvisorProfile />} />
              <Route path="/advisor/:id" element={<AdvisorProfileDetailPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/advisor-directory" element={<AdvisorDirectoryPage />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/loan-comparison" element={<LoanComparison />} />
              <Route path="/loan-optimization" element={<LoanOptimization />} />
              <Route path="/loan-eligibility" element={<LoanEligibility />} />
              <Route path="/ai-advisory" element={<AIAdvisory />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/document-checklist" element={<DocumentChecklistPage />} />
              <Route path="/khao-sat" element={<KhaoSat />} />
              <Route path="/ket-qua" element={<KetQua />} />
              <Route path="/so-sanh" element={<SoSanh />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/knowledge-management" element={<KnowledgeManagement />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/system-analytics" element={<SystemAnalytics />} />
              <Route path="/financial-guides" element={<FinancialGuidesPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              
              {/* Vietnamese routes - redirect to English equivalents */}
              <Route path="/kiem-tra-dieu-kien" element={<LoanEligibility />} />
              <Route path="/toi-uu-hoa-vay" element={<LoanOptimization />} />
              <Route path="/tu-van-ai" element={<AIAdvisory />} />
              <Route path="/ho-so-tai-lieu" element={<DocumentChecklistPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
