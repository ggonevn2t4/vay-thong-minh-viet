
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'advisor' | 'customer';
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Advisor extends User {
  role: 'advisor';
  title: string;
  specializations: string[];
  rating: number;
  totalClients: number;
  completedLoans: number;
  experience: number;
  location: string;
  bankAffiliation?: string;
}

export interface Customer extends User {
  role: 'customer';
  creditScore?: number;
  totalLoanRequests: number;
  approvedLoans: number;
  assignedAdvisor?: string;
  location: string;
  phone?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalAdvisors: number;
  totalCustomers: number;
  activeLoans: number;
  pendingRequests: number;
  completedLoans: number;
  monthlyGrowth: number;
  revenue: number;
}
