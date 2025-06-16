
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, Users, FileText, DollarSign, CheckCircle } from 'lucide-react';

interface ReportData {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalLoanAmount: number;
  approvedLoanAmount: number;
  averageProcessingTime: number;
  approvalRate: number;
  recentApplications: any[];
  monthlyTrends: any[];
}

const ReportsTab = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0,
    totalLoanAmount: 0,
    approvedLoanAmount: 0,
    averageProcessingTime: 0,
    approvalRate: 0,
    recentApplications: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      // Fetch loan applications
      const { data: applications, error: appsError } = await supabase
        .from('loan_applications')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          ),
          loan_application_reviews (
            review_status,
            reviewed_at
          )
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;

      // Calculate statistics
      const totalApplications = applications?.length || 0;
      const approvedApplications = applications?.filter(app => app.status === 'approved').length || 0;
      const rejectedApplications = applications?.filter(app => app.status === 'rejected').length || 0;
      const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;

      const totalLoanAmount = applications?.reduce((sum, app) => sum + (app.amount || 0), 0) || 0;
      const approvedLoanAmount = applications
        ?.filter(app => app.status === 'approved')
        .reduce((sum, app) => sum + (app.amount || 0), 0) || 0;

      const approvalRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

      // Calculate average processing time
      const processedApps = applications?.filter(app => 
        app.status !== 'pending' && app.loan_application_reviews?.length > 0
      ) || [];
      
      const avgProcessingTime = processedApps.length > 0 
        ? processedApps.reduce((sum, app) => {
            const createdAt = new Date(app.created_at);
            const reviewedAt = new Date(app.loan_application_reviews[0]?.reviewed_at || app.created_at);
            return sum + (reviewedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / processedApps.length
        : 0;

      setReportData({
        totalApplications,
        approvedApplications,
        rejectedApplications,
        pendingApplications,
        totalLoanAmount,
        approvedLoanAmount,
        averageProcessingTime: Math.round(avgProcessingTime * 10) / 10,
        approvalRate: Math.round(approvalRate * 10) / 10,
        recentApplications: applications?.slice(0, 10) || [],
        monthlyTrends: []
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Lỗi khi tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Báo cáo & Thống kê</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 ngày qua</SelectItem>
            <SelectItem value="30">30 ngày qua</SelectItem>
            <SelectItem value="90">3 tháng qua</SelectItem>
            <SelectItem value="365">1 năm qua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đơn vay</p>
                <p className="text-3xl font-bold text-gray-900">{reportData.totalApplications}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ lệ duyệt</p>
                <p className="text-3xl font-bold text-green-600">{reportData.approvalRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số tiền</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(reportData.totalLoanAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thời gian xử lý TB</p>
                <p className="text-3xl font-bold text-orange-600">{reportData.averageProcessingTime} ngày</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">{reportData.approvedApplications}</p>
              <p className="text-sm text-gray-500">{formatCurrency(reportData.approvedLoanAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{reportData.pendingApplications}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Từ chối</p>
              <p className="text-2xl font-bold text-red-600">{reportData.rejectedApplications}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn vay gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{app.profiles?.full_name || 'Khách hàng'}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(app.amount)} - {app.term_months} tháng</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(app.status)}>
                    {getStatusText(app.status)}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(app.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
