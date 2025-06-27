
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BankEmployeeDashboard from "./pages/BankEmployeeDashboard";
import RoleBasedDashboard from "./components/dashboard/RoleBasedDashboard";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import AdvisorDirectory from "./pages/AdvisorDirectory";
import AdvisorProfile from "./pages/AdvisorProfile";
import AdvisorProfileDetail from "./pages/AdvisorProfileDetail";
import LoanComparison from "./pages/LoanComparison";
import LoanEligibility from "./pages/LoanEligibility";
import LoanOptimization from "./pages/LoanOptimization";
import DocumentChecklistPage from "./pages/DocumentChecklistPage";
import AIAdvisory from "./pages/AIAdvisory";
import SystemAnalytics from "./pages/SystemAnalytics";
import KnowledgeManagement from "./pages/KnowledgeManagement";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Wallet from "./pages/Wallet";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import FinancialGuides from "./pages/FinancialGuides";
import NotFound from "./pages/NotFound";
import KhaoSat from "./pages/KhaoSat";
import KetQua from "./pages/KetQua";
import SoSanh from "./pages/SoSanh";
import LoanApplication from "./pages/LoanApplication";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<RoleBasedDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/bank-employee-dashboard" element={<BankEmployeeDashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/advisor-directory" element={<AdvisorDirectory />} />
              <Route path="/advisor-profile" element={<AdvisorProfile />} />
              <Route path="/advisor/:id" element={<AdvisorProfileDetail />} />
              <Route path="/loan-comparison" element={<LoanComparison />} />
              <Route path="/loan-eligibility" element={<LoanEligibility />} />
              <Route path="/loan-optimization" element={<LoanOptimization />} />
              <Route path="/document-checklist" element={<DocumentChecklistPage />} />
              <Route path="/ai-advisory" element={<AIAdvisory />} />
              <Route path="/system-analytics" element={<SystemAnalytics />} />
              <Route path="/knowledge-management" element={<KnowledgeManagement />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/guides" element={<FinancialGuides />} />
              <Route path="/khao-sat" element={<KhaoSat />} />
              <Route path="/ket-qua" element={<KetQua />} />
              <Route path="/so-sanh" element={<SoSanh />} />
              <Route path="/loan-application" element={<LoanApplication />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
