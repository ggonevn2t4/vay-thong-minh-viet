import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus
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

interface OfferComparisonToolProps {
  offers: BankOffer[];
}

const OfferComparisonTool: React.FC<OfferComparisonToolProps> = ({ offers }) => {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleOfferSelect = (offerId: string, checked: boolean) => {
    if (checked) {
      if (selectedOffers.length < 4) {
        setSelectedOffers([...selectedOffers, offerId]);
      }
    } else {
      setSelectedOffers(selectedOffers.filter(id => id !== offerId));
    }
  };

  const compareOffers = () => {
    setShowComparison(true);
  };

  const clearComparison = () => {
    setSelectedOffers([]);
    setShowComparison(false);
  };

  const selectedOfferDetails = offers.filter(offer => selectedOffers.includes(offer.id));

  const getBestValue = (key: keyof BankOffer, compareType: 'lower' | 'higher') => {
    if (selectedOfferDetails.length === 0) return null;
    
    const values = selectedOfferDetails.map(offer => offer[key] as number).filter(val => typeof val === 'number');
    if (values.length === 0) return null;
    
    return compareType === 'lower' ? Math.min(...values) : Math.max(...values);
  };

  const getValueComparison = (value: number, bestValue: number | null, compareType: 'lower' | 'higher') => {
    if (bestValue === null) return 'neutral';
    if (value === bestValue) return 'best';
    if (compareType === 'lower') {
      return value > bestValue ? 'worse' : 'better';
    } else {
      return value < bestValue ? 'worse' : 'better';
    }
  };

  const getComparisonIcon = (comparison: string) => {
    switch (comparison) {
      case 'best': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'better': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'worse': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>So sánh đề nghị vay</CardTitle>
          <p className="text-sm text-gray-600">
            Chọn tối đa 4 đề nghị để so sánh chi tiết. Đã chọn: {selectedOffers.length}/4
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Button 
              onClick={compareOffers} 
              disabled={selectedOffers.length < 2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              So sánh ({selectedOffers.length})
            </Button>
            {selectedOffers.length > 0 && (
              <Button variant="outline" onClick={clearComparison}>
                Xóa lựa chọn
              </Button>
            )}
          </div>

          {/* Offer Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <Card key={offer.id} className={`cursor-pointer transition-all ${
                selectedOffers.includes(offer.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedOffers.includes(offer.id)}
                      onCheckedChange={(checked) => handleOfferSelect(offer.id, checked as boolean)}
                      disabled={!selectedOffers.includes(offer.id) && selectedOffers.length >= 4}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                            {offer.bank_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-sm">{offer.bank_name}</h3>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số tiền:</span>
                          <span className="font-medium">{formatCurrency(offer.offered_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lãi suất:</span>
                          <span className="font-medium">{offer.interest_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời hạn:</span>
                          <span className="font-medium">{offer.term_months} tháng</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {showComparison && selectedOfferDetails.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Bảng so sánh chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-left font-semibold">Tiêu chí</th>
                    {selectedOfferDetails.map((offer) => (
                      <th key={offer.id} className="border border-gray-200 p-3 text-center min-w-[150px]">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {offer.bank_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold">{offer.bank_name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Amount Row */}
                  <tr>
                    <td className="border border-gray-200 p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Số tiền đề nghị
                      </div>
                    </td>
                    {selectedOfferDetails.map((offer) => {
                      const bestAmount = getBestValue('offered_amount', 'higher');
                      const comparison = getValueComparison(offer.offered_amount, bestAmount, 'higher');
                      return (
                        <td key={offer.id} className="border border-gray-200 p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getComparisonIcon(comparison)}
                            <span className="font-semibold">{formatCurrency(offer.offered_amount)}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Interest Rate Row */}
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-blue-600" />
                        Lãi suất
                      </div>
                    </td>
                    {selectedOfferDetails.map((offer) => {
                      const bestRate = getBestValue('interest_rate', 'lower');
                      const comparison = getValueComparison(offer.interest_rate, bestRate, 'lower');
                      return (
                        <td key={offer.id} className="border border-gray-200 p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getComparisonIcon(comparison)}
                            <span className="font-semibold">{offer.interest_rate}%/năm</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Term Row */}
                  <tr>
                    <td className="border border-gray-200 p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Thời hạn vay
                      </div>
                    </td>
                    {selectedOfferDetails.map((offer) => (
                      <td key={offer.id} className="border border-gray-200 p-3 text-center">
                        <span className="font-semibold">{offer.term_months} tháng</span>
                      </td>
                    ))}
                  </tr>

                  {/* Processing Time Row */}
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-3 font-medium">Thời gian xử lý</td>
                    {selectedOfferDetails.map((offer) => (
                      <td key={offer.id} className="border border-gray-200 p-3 text-center">
                        <span className="font-semibold">
                          {offer.processing_time_days ? `${offer.processing_time_days} ngày` : 'Chưa rõ'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Status Row */}
                  <tr>
                    <td className="border border-gray-200 p-3 font-medium">Trạng thái</td>
                    {selectedOfferDetails.map((offer) => (
                      <td key={offer.id} className="border border-gray-200 p-3 text-center">
                        <Badge variant="outline" className="capitalize">
                          {offer.status === 'pending' && 'Đang chờ'}
                          {offer.status === 'accepted' && 'Đã chấp nhận'}
                          {offer.status === 'declined' && 'Đã từ chối'}
                          {offer.status === 'expired' && 'Đã hết hạn'}
                          {offer.status === 'under_review' && 'Đang xem xét'}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Conditions Row */}
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-3 font-medium">Điều kiện</td>
                    {selectedOfferDetails.map((offer) => (
                      <td key={offer.id} className="border border-gray-200 p-3">
                        <div className="text-sm max-w-[200px]">
                          {offer.conditions || 'Không có thông tin'}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Tóm tắt so sánh:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Lãi suất tốt nhất:</span>
                  <p className="font-bold text-blue-900">{getBestValue('interest_rate', 'lower')}%</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Số tiền cao nhất:</span>
                  <p className="font-bold text-blue-900">{formatCurrency(getBestValue('offered_amount', 'higher') || 0)}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Đề nghị đang chờ:</span>
                  <p className="font-bold text-blue-900">
                    {selectedOfferDetails.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OfferComparisonTool;