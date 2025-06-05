
import { useState, useEffect } from 'react';

interface DashboardData {
  monthlyData: Array<{
    month: string;
    loans: number;
    revenue: number;
    applications: number;
    approvalRate: number;
  }>;
  loanTypeData: Array<{
    name: string;
    value: number;
    amount: number;
    color: string;
  }>;
  advisorPerformance: Array<{
    name: string;
    clients: number;
    conversion: number;
    revenue: number;
  }>;
  performanceMetrics: Array<{
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: any;
    color: string;
    description: string;
  }>;
  lastUpdated: Date;
}

export const useDashboardData = (refreshInterval: number = 30000) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const generateMockData = (): DashboardData => {
    const baseMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyData = baseMonth.map(month => ({
      month,
      loans: Math.floor(Math.random() * 30) + 40,
      revenue: Math.floor(Math.random() * 600000000) + 1200000000,
      applications: Math.floor(Math.random() * 40) + 80,
      approvalRate: Math.floor(Math.random() * 15) + 65
    }));

    const loanTypeData = [
      { name: 'Vay tiêu dùng', value: 35, amount: 2400000000, color: '#3B82F6' },
      { name: 'Vay mua nhà', value: 28, amount: 4200000000, color: '#10B981' },
      { name: 'Vay mua xe', value: 22, amount: 1800000000, color: '#F59E0B' },
      { name: 'Vay kinh doanh', value: 15, amount: 3100000000, color: '#EF4444' },
    ];

    const advisorPerformance = [
      { name: 'Nguyễn Thị Lan', clients: 45, conversion: 82, revenue: 850000000 },
      { name: 'Trần Văn Minh', clients: 38, conversion: 76, revenue: 720000000 },
      { name: 'Lê Thị Hoa', clients: 42, conversion: 79, revenue: 790000000 },
      { name: 'Phạm Văn Đức', clients: 35, conversion: 73, revenue: 650000000 },
    ];

    const performanceMetrics = [
      {
        title: "Tỷ lệ chuyển đổi",
        value: "23.5%",
        change: "+2.1%",
        trend: "up" as const,
        icon: null,
        color: "text-green-600",
        description: "Tăng so với tháng trước"
      },
      {
        title: "Thời gian xử lý TB",
        value: "3.2 ngày",
        change: "-0.5 ngày",
        trend: "up" as const,
        icon: null,
        color: "text-blue-600",
        description: "Cải thiện hiệu suất"
      },
      {
        title: "Điểm hài lòng KH",
        value: "4.8/5",
        change: "+0.2",
        trend: "up" as const,
        icon: null,
        color: "text-purple-600",
        description: "Phản hồi tích cực"
      },
      {
        title: "Tăng trưởng tháng",
        value: "12.5%",
        change: "+3.2%",
        trend: "up" as const,
        icon: null,
        color: "text-orange-600",
        description: "Vượt mục tiêu"
      }
    ];

    return {
      monthlyData,
      loanTypeData,
      advisorPerformance,
      performanceMetrics,
      lastUpdated: new Date()
    };
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setData(generateMockData());
      setLastRefresh(new Date());
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshData();
    
    const interval = setInterval(refreshData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    data,
    isLoading,
    lastRefresh,
    refreshData
  };
};
