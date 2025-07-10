import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedCICWarningSystem from '@/components/cic/EnhancedCICWarningSystem';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  MessageCircle,
  CreditCard,
  Target,
  Star,
  ArrowRight,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface LoanApplication {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  loan_type: string;
  term_months: number;
}

interface ProfileData {
  full_name: string;
  monthly_income: number;
  employment_type: string;
  kyc_verified: boolean;
}

const EnhancedUserDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch loan applications
      const { data: loanData, error: loanError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (loanError) throw loanError;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setApplications(loanData || []);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Lỗi khi tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'pending': return 'Chờ duyệt';
      case 'reviewing': return 'Đang xem xét';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const reviewing = applications.filter(app => app.status === 'reviewing').length;
    
    return { total, approved, pending, reviewing };
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    
    const fields = [
      'full_name',
      'monthly_income',
      'employment_type',
      'kyc_verified'
    ];
    
    const completedFields = fields.filter(field => {
      if (field === 'kyc_verified') return profile[field] === true;
      return profile[field] !== null && profile[field] !== undefined && profile[field] !== '';
    });
    
    return (completedFields.length / fields.length) * 100;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải dashboard...</div>;
  }

  const stats = getApplicationStats();
  const profileCompleteness = getProfileCompleteness();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Chào mừng, {profile?.full_name || 'Người dùng'}!
            </h1>
            <p className="text-blue-100">
              Quản lý các khoản vay và theo dõi tiến trình của bạn
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Hồ sơ hoàn thành</div>
            <div className="text-2xl font-bold">{Math.round(profileCompleteness)}%</div>
          </div>
        </div>
      </div>

      {/* CIC Warning System */}
      <EnhancedCICWarningSystem />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Tổng đơn vay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Đã duyệt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending + stats.reviewing}</p>
                <p className="text-sm text-muted-foreground">Đang xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profile?.kyc_verified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
                <p className="text-sm text-muted-foreground">Trạng thái KYC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="applications">Đơn vay</TabsTrigger>
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          <TabsTrigger value="insights">Thông tin</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Hoàn thiện hồ sơ</span>
                <Badge variant={profileCompleteness === 100 ? "default" : "secondary"}>
                  {Math.round(profileCompleteness)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={profileCompleteness} className="mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Hoàn thiện hồ sơ để tăng cơ hội được duyệt vay
              </p>
              <Button variant="outline" size="sm">
                Cập nhật hồ sơ
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  Đăng ký vay mới
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <MessageCircle className="h-6 w-6" />
                  Nhắn tin tư vấn viên
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Target className="h-6 w-6" />
                  So sánh lãi suất
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Đơn vay gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{app.loan_type || 'Vay tín chấp'}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(app.amount)} - {app.term_months} tháng
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusText(app.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Bạn chưa có đơn vay nào</p>
                  <Button className="mt-4">
                    Đăng ký vay ngay
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{app.loan_type || 'Vay tín chấp'}</span>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusText(app.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Số tiền: {formatCurrency(app.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Thời hạn: {app.term_months} tháng
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ngày đăng ký: {new Date(app.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Họ tên</label>
                    <p className="text-lg">{profile.full_name || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Thu nhập hàng tháng</label>
                    <p className="text-lg">
                      {profile.monthly_income ? formatCurrency(profile.monthly_income) : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Loại công việc</label>
                    <p className="text-lg">{profile.employment_type || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Trạng thái xác thực</label>
                    <div className="flex items-center gap-2">
                      {profile.kyc_verified ? (
                        <Badge className="bg-green-100 text-green-800">Đã xác thực</Badge>
                      ) : (
                        <Badge variant="outline">Chưa xác thực</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Button>Cập nhật thông tin</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Tỷ lệ duyệt đơn</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Đã duyệt</span>
                      <span>{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</span>
                    </div>
                    <Progress value={stats.total > 0 ? (stats.approved / stats.total) * 100 : 0} />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Mức độ hoàn thiện hồ sơ</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hoàn thành</span>
                      <span>{Math.round(profileCompleteness)}%</span>
                    </div>
                    <Progress value={profileCompleteness} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedUserDashboard;