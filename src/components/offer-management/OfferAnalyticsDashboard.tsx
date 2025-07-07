import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertCircle,
  Clock,
  DollarSign,
  Percent,
  Building2,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
  offer_advantages?: string[];
  required_documents?: string[];
  advisor_id?: string;
}

interface OfferAnalyticsDashboardProps {
  offers: BankOffer[];
}

interface BankAnalytics {
  bankName: string;
  totalOffers: number;
  acceptanceRate: number;
  averageRate: number;
  averageAmount: number;
  bestRate: number;
  totalAmount: number;
}

interface TimeAnalytics {
  month: string;
  offers: number;
  accepted: number;
  avgRate: number;
}

const OfferAnalyticsDashboard: React.FC<OfferAnalyticsDashboardProps> = ({ offers }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Bank analytics
    const bankStats = offers.reduce((acc, offer) => {
      if (!acc[offer.bank_name]) {
        acc[offer.bank_name] = {
          total: 0,
          accepted: 0,
          totalAmount: 0,
          rates: []
        };
      }
      
      acc[offer.bank_name].total += 1;
      if (offer.status === 'accepted') {
        acc[offer.bank_name].accepted += 1;
      }
      acc[offer.bank_name].totalAmount += offer.offered_amount;
      acc[offer.bank_name].rates.push(offer.interest_rate);
      
      return acc;
    }, {} as Record<string, any>);

    const bankAnalytics: BankAnalytics[] = Object.entries(bankStats).map(([bankName, stats]) => ({
      bankName,
      totalOffers: stats.total,
      acceptanceRate: stats.total > 0 ? (stats.accepted / stats.total) * 100 : 0,
      averageRate: stats.rates.length > 0 ? stats.rates.reduce((a: number, b: number) => a + b, 0) / stats.rates.length : 0,
      averageAmount: stats.totalAmount / stats.total,
      bestRate: Math.min(...stats.rates),
      totalAmount: stats.totalAmount
    }));

    // Time-based analytics
    const timeAnalytics: TimeAnalytics[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthOffers = offers.filter(offer => {
        const offerDate = new Date(offer.created_at);
        return offerDate.getFullYear() === date.getFullYear() && 
               offerDate.getMonth() === date.getMonth();
      });

      timeAnalytics.push({
        month: date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
        offers: monthOffers.length,
        accepted: monthOffers.filter(o => o.status === 'accepted').length,
        avgRate: monthOffers.length > 0 
          ? monthOffers.reduce((sum, o) => sum + o.interest_rate, 0) / monthOffers.length 
          : 0
      });
    }

    // Recent offers (last 30 days)
    const recentOffers = offers.filter(offer => 
      new Date(offer.created_at) >= thirtyDaysAgo
    );

    // Overall statistics
    const totalOffers = offers.length;
    const acceptedOffers = offers.filter(o => o.status === 'accepted').length;
    const pendingOffers = offers.filter(o => o.status === 'pending').length;
    const declinedOffers = offers.filter(o => o.status === 'declined').length;
    const expiredOffers = offers.filter(o => {
      if (!o.offer_expires_at) return false;
      return new Date(o.offer_expires_at) < now;
    }).length;

    const allRates = offers.map(o => o.interest_rate).filter(rate => rate > 0);
    const averageRate = allRates.length > 0 ? allRates.reduce((a, b) => a + b, 0) / allRates.length : 0;
    const bestRate = allRates.length > 0 ? Math.min(...allRates) : 0;
    const worstRate = allRates.length > 0 ? Math.max(...allRates) : 0;

    const totalOfferedAmount = offers.reduce((sum, o) => sum + o.offered_amount, 0);
    const averageAmount = totalOffers > 0 ? totalOfferedAmount / totalOffers : 0;

    return {
      bankAnalytics: bankAnalytics.sort((a, b) => b.totalOffers - a.totalOffers),
      timeAnalytics,
      recentOffers,
      overall: {
        totalOffers,
        acceptedOffers,
        pendingOffers,
        declinedOffers,
        expiredOffers,
        acceptanceRate: totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0,
        averageRate,
        bestRate,
        worstRate,
        totalOfferedAmount,
        averageAmount
      }
    };
  }, [offers]);

  const getPerformanceColor = (rate: number, benchmark: number) => {
    if (rate < benchmark * 0.9) return 'text-green-600';
    if (rate > benchmark * 1.1) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getPerformanceIcon = (rate: number, benchmark: number) => {
    if (rate < benchmark * 0.9) return <TrendingDown className="w-4 h-4 text-green-600" />;
    if (rate > benchmark * 1.1) return <TrendingUp className="w-4 h-4 text-red-600" />;
    return <Award className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đề nghị</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overall.totalOffers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Tỷ lệ chấp nhận: {analytics.overall.acceptanceRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lãi suất trung bình</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overall.averageRate.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  Tốt nhất: {analytics.overall.bestRate.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giá trị đề nghị</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overall.totalOfferedAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Trung bình: {formatCurrency(analytics.overall.averageAmount)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.overall.pendingOffers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Đã hết hạn: {analytics.overall.expiredOffers}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích hiệu suất theo ngân hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analytics.bankAnalytics.map((bank) => (
              <div key={bank.bankName} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {bank.bankName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{bank.bankName}</h3>
                      <p className="text-sm text-gray-600">
                        {bank.totalOffers} đề nghị • Tỷ lệ chấp nhận: {bank.acceptanceRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {getPerformanceIcon(bank.averageRate, analytics.overall.averageRate)}
                      <span className={`font-semibold ${getPerformanceColor(bank.averageRate, analytics.overall.averageRate)}`}>
                        {bank.averageRate.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Lãi suất TB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Tổng đề nghị</p>
                    <p className="text-lg font-bold">{bank.totalOffers}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Lãi suất tốt nhất</p>
                    <p className="text-lg font-bold text-green-700">{bank.bestRate.toFixed(2)}%</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Số tiền TB</p>
                    <p className="text-lg font-bold text-blue-700">{formatCurrency(bank.averageAmount)}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Tỷ lệ chấp nhận</p>
                    <div className="flex items-center gap-2">
                      <Progress value={bank.acceptanceRate} className="flex-1" />
                      <span className="text-sm font-medium">{bank.acceptanceRate.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng theo thời gian (6 tháng gần nhất)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.timeAnalytics.map((period, index) => (
              <div key={period.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold">{period.month}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        {period.accepted}/{period.offers} đề nghị
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        Lãi suất TB: {period.avgRate > 0 ? period.avgRate.toFixed(2) : 'N/A'}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress 
                    value={period.offers > 0 ? (period.accepted / period.offers) * 100 : 0} 
                    className="w-24" 
                  />
                  <span className="text-xs text-gray-600 min-w-[40px]">
                    {period.offers > 0 ? Math.round((period.accepted / period.offers) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Khuyến nghị và insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.overall.bestRate > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Cơ hội tốt nhất</h4>
                <p className="text-sm text-green-700">
                  Lãi suất tốt nhất hiện tại là {analytics.overall.bestRate.toFixed(2)}%, 
                  thấp hơn {(analytics.overall.averageRate - analytics.overall.bestRate).toFixed(2)}% 
                  so với mức trung bình thị trường.
                </p>
              </div>
            )}

            {analytics.overall.pendingOffers > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⏰ Cần hành động</h4>
                <p className="text-sm text-yellow-700">
                  Bạn có {analytics.overall.pendingOffers} đề nghị đang chờ phản hồi. 
                  Hãy xem xét và phản hồi kịp thời để không bỏ lỡ cơ hội.
                </p>
              </div>
            )}

            {analytics.overall.acceptanceRate < 50 && analytics.overall.totalOffers > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Tối ưu hóa</h4>
                <p className="text-sm text-blue-700">
                  Tỷ lệ chấp nhận đề nghị của bạn là {analytics.overall.acceptanceRate.toFixed(1)}%. 
                  Có thể bạn nên xem xét các điều kiện vay để tăng khả năng được chấp thuận.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferAnalyticsDashboard;