
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText, User } from 'lucide-react';
import UserOverviewTab from './UserOverviewTab';
import UserLoansTab from './UserLoansTab';
import EnhancedAnalyticsDashboard from './EnhancedAnalyticsDashboard';

interface LoanApplication {
  id: string;
  date: string;
  amount: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  type: string;
}

interface UserDashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  applications: LoanApplication[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const UserDashboardTabs = ({ 
  activeTab, 
  onTabChange, 
  applications, 
  getStatusColor, 
  getStatusText 
}: UserDashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Tổng quan</span>
        </TabsTrigger>
        <TabsTrigger value="loans" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Khoản vay</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Phân tích</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <UserOverviewTab 
          applications={applications}
          onViewAllLoans={() => onTabChange('loans')}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      </TabsContent>

      <TabsContent value="loans" className="space-y-6">
        <UserLoansTab 
          applications={applications}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <EnhancedAnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default UserDashboardTabs;
