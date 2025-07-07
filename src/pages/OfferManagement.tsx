import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Percent,
  Building2,
  MessageSquareX,
  Eye,
  BarChart3,
  Archive,
  Target
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import OfferComparisonTool from '@/components/offer-management/OfferComparisonTool';
import OfferAnalyticsDashboard from '@/components/offer-management/OfferAnalyticsDashboard';
import OfferStatusManager from '@/components/offer-management/OfferStatusManager';

type OfferStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'under_review';

interface BankOffer {
  id: string;
  loan_application_id: string;
  bank_name: string;
  offered_amount: number;
  interest_rate: number;
  term_months: number;
  status: OfferStatus;
  conditions?: string;
  processing_time_days?: number;
  offer_expires_at?: string;
  created_at: string;
  updated_at: string;
  offer_advantages?: any[];
  required_documents?: any[];
  advisor_id?: string;
}

interface OfferStats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
  expired: number;
  averageRate: number;
  bestRate: number;
  totalOfferedAmount: number;
}

const OfferManagement = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<BankOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bankFilter, setBankFilter] = useState<string>('all');
  const [offerStats, setOfferStats] = useState<OfferStats | null>(null);

  useEffect(() => {
    if (user) {
      fetchOffers();
    }
  }, [user]);

  const fetchOffers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user's loan applications
      const { data: applications, error: appError } = await supabase
        .from('loan_applications')
        .select('id')
        .eq('user_id', user.id);

      if (appError) throw appError;

      if (!applications || applications.length === 0) {
        setOffers([]);
        setOfferStats({
          total: 0, pending: 0, accepted: 0, declined: 0, expired: 0,
          averageRate: 0, bestRate: 0, totalOfferedAmount: 0
        });
        return;
      }

      const applicationIds = applications.map(app => app.id);

      // Get offers for user's applications
      const { data: offersData, error: offersError } = await supabase
        .from('bank_loan_offers')
        .select('*')
        .in('loan_application_id', applicationIds)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      const processedOffers: BankOffer[] = (offersData || []).map(offer => ({
        ...offer,
        offer_advantages: Array.isArray(offer.offer_advantages) ? offer.offer_advantages : [],
        required_documents: Array.isArray(offer.required_documents) ? offer.required_documents : [],
        status: offer.status as OfferStatus
      }));

      setOffers(processedOffers);
      
      // Calculate statistics
      const stats = calculateOfferStats(processedOffers);
      setOfferStats(stats);

    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Không thể tải danh sách đề nghị');
    } finally {
      setLoading(false);
    }
  };

  const calculateOfferStats = (offers: BankOffer[]): OfferStats => {
    const total = offers.length;
    const pending = offers.filter(o => o.status === 'pending').length;
    const accepted = offers.filter(o => o.status === 'accepted').length;
    const declined = offers.filter(o => o.status === 'declined').length;
    const expired = offers.filter(o => isOfferExpired(o)).length;
    
    const rates = offers.map(o => o.interest_rate).filter(rate => rate > 0);
    const averageRate = rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
    const bestRate = rates.length > 0 ? Math.min(...rates) : 0;
    const totalOfferedAmount = offers.reduce((sum, o) => sum + o.offered_amount, 0);

    return {
      total,
      pending,
      accepted,
      declined,
      expired,
      averageRate,
      bestRate,
      totalOfferedAmount
    };
  };

  const isOfferExpired = (offer: BankOffer): boolean => {
    if (!offer.offer_expires_at) return false;
    return new Date(offer.offer_expires_at) < new Date();
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'declined';
      
      const { error } = await supabase
        .from('bank_loan_offers')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', offerId);

      if (error) throw error;

      // Update local state
      setOffers(prev => prev.map(offer => 
        offer.id === offerId ? { ...offer, status: newStatus as OfferStatus } : offer
      ));

      // Recalculate stats with updated offers
      const updatedOffers = offers.map(offer => 
        offer.id === offerId ? { ...offer, status: newStatus as OfferStatus } : offer
      );
      setOfferStats(calculateOfferStats(updatedOffers));

      toast.success(action === 'accept' ? 'Đã chấp nhận đề nghị' : 'Đã từ chối đề nghị');
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Không thể cập nhật đề nghị');
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.bank_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    const matchesBank = bankFilter === 'all' || offer.bank_name === bankFilter;
    
    return matchesSearch && matchesStatus && matchesBank;
  });

  const uniqueBanks = [...new Set(offers.map(offer => offer.bank_name))];

  const getStatusColor = (status: OfferStatus) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusIcon = (status: OfferStatus) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'expired': return <Archive className="w-4 h-4 text-gray-500" />;
      case 'under_review': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Bạn cần đăng nhập để xem quản lý đề nghị vay.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý đề nghị vay</h1>
            <p className="text-gray-600 mt-2">
              Theo dõi và quản lý tất cả đề nghị vay từ các ngân hàng
            </p>
          </div>
          <Button onClick={fetchOffers} disabled={loading}>
            {loading ? 'Đang tải...' : 'Làm mới'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Tổng quan</TabsTrigger>
            <TabsTrigger value="offers">Danh sách đề nghị</TabsTrigger>
            <TabsTrigger value="comparison">So sánh</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {offerStats && (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tổng đề nghị</p>
                          <p className="text-2xl font-bold text-gray-900">{offerStats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <MessageSquareX className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                          <p className="text-2xl font-bold text-yellow-600">{offerStats.pending}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                          <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Lãi suất tốt nhất</p>
                          <p className="text-2xl font-bold text-green-600">{offerStats.bestRate.toFixed(2)}%</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <TrendingDown className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tổng số tiền đề nghị</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {formatCurrency(offerStats.totalOfferedAmount)}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                          <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố trạng thái đề nghị</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Đang chờ xử lý</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(offerStats.pending / offerStats.total) * 100} className="w-32" />
                          <span className="text-sm text-gray-600">{offerStats.pending}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Đã chấp nhận</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(offerStats.accepted / offerStats.total) * 100} className="w-32" />
                          <span className="text-sm text-gray-600">{offerStats.accepted}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Đã từ chối</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(offerStats.declined / offerStats.total) * 100} className="w-32" />
                          <span className="text-sm text-gray-600">{offerStats.declined}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Tìm kiếm theo tên ngân hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Đang chờ</SelectItem>
                      <SelectItem value="accepted">Đã chấp nhận</SelectItem>
                      <SelectItem value="declined">Đã từ chối</SelectItem>
                      <SelectItem value="expired">Đã hết hạn</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={bankFilter} onValueChange={setBankFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Lọc theo ngân hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả ngân hàng</SelectItem>
                      {uniqueBanks.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Offers List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải đề nghị vay...</p>
                </div>
              ) : filteredOffers.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquareX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Không có đề nghị vay nào
                    </h3>
                    <p className="text-gray-600">
                      {offers.length === 0 
                        ? 'Bạn chưa có đề nghị vay nào từ ngân hàng.'
                        : 'Không tìm thấy đề nghị vay phù hợp với bộ lọc.'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredOffers.map((offer) => {
                  const isExpired = isOfferExpired(offer);
                  const currentStatus: OfferStatus = isExpired ? 'expired' : offer.status;
                  
                  return (
                    <Card key={offer.id} className={isExpired ? 'opacity-60' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                {offer.bank_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {offer.bank_name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusIcon(currentStatus)}
                                <Badge className={getStatusColor(currentStatus)}>
                                  {currentStatus === 'accepted' && 'Đã chấp nhận'}
                                  {currentStatus === 'declined' && 'Đã từ chối'}
                                  {currentStatus === 'pending' && 'Đang chờ'}
                                  {currentStatus === 'expired' && 'Đã hết hạn'}
                                  {currentStatus === 'under_review' && 'Đang xem xét'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {offer.offer_expires_at && (
                            <div className="text-right text-sm text-gray-500">
                              <p>Hết hạn:</p>
                              <p className="font-medium">
                                {new Date(offer.offer_expires_at).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-sm font-medium">Số tiền đề nghị</span>
                            </div>
                            <p className="text-xl font-bold text-blue-900">
                              {formatCurrency(offer.offered_amount)}
                            </p>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                              <Percent className="w-4 h-4" />
                              <span className="text-sm font-medium">Lãi suất</span>
                            </div>
                            <p className="text-xl font-bold text-green-900">
                              {offer.interest_rate}%/năm
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-600 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">Thời hạn</span>
                            </div>
                            <p className="text-xl font-bold text-purple-900">
                              {offer.term_months} tháng
                            </p>
                          </div>
                        </div>

                        {offer.conditions && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Điều kiện:</p>
                            <p className="text-sm text-gray-600">{offer.conditions}</p>
                          </div>
                        )}

                        {offer.status === 'pending' && !isExpired && (
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleOfferAction(offer.id, 'accept')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Chấp nhận
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => handleOfferAction(offer.id, 'decline')}
                              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Từ chối
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <OfferComparisonTool offers={offers} />
          </TabsContent>

          <TabsContent value="analytics">
            <OfferAnalyticsDashboard offers={offers} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OfferManagement;