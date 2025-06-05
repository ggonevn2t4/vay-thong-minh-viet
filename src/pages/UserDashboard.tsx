
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import UserDashboardHeader from '@/components/dashboard/UserDashboardHeader';
import UserDashboardTabs from '@/components/dashboard/UserDashboardTabs';

interface LoanApplication {
  id: string;
  date: string;
  amount: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  type: string;
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState<LoanApplication[]>([
    {
      id: 'LA-2023-001',
      date: '2023-05-15',
      amount: 150000000,
      term: 12,
      status: 'approved',
      type: 'Vay tín chấp'
    },
    {
      id: 'LA-2023-002',
      date: '2023-07-22',
      amount: 300000000,
      term: 24,
      status: 'pending',
      type: 'Vay thế chấp'
    },
    {
      id: 'LA-2023-003',
      date: '2023-09-10',
      amount: 50000000,
      term: 6,
      status: 'rejected',
      type: 'Vay tiêu dùng'
    },
    {
      id: 'LA-2023-004',
      date: '2023-11-05',
      amount: 200000000,
      term: 36,
      status: 'reviewing',
      type: 'Vay mua xe'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'reviewing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending':
        return 'Chờ duyệt';
      case 'reviewing':
        return 'Đang xem xét';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <UserDashboardHeader />
        <UserDashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          applications={applications}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      </div>
    </Layout>
  );
};

export default UserDashboard;
