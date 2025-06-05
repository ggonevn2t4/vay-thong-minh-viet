
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock, Star, MessageCircle, ArrowRight, TrendingUp } from 'lucide-react';

interface LoanRequest {
  id: string;
  borrowerName: string;
  amount: number;
  purpose: string;
  term: number;
  location: string;
  creditScore: number;
  description: string;
  status: 'open' | 'in_negotiation' | 'approved' | 'closed';
  createdAt: string;
  offers: number;
}

interface LoanRequestCardProps {
  request: LoanRequest;
}

const LoanRequestCard = ({ request }: LoanRequestCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_negotiation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Đang mở';
      case 'in_negotiation':
        return 'Đang thương lượng';
      case 'approved':
        return 'Đã duyệt';
      case 'closed':
        return 'Đã đóng';
      default:
        return status;
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600 bg-green-50';
    if (score >= 650) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Xuất sắc';
    if (score >= 650) return 'Tốt';
    return 'Cần cải thiện';
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
              {request.borrowerName.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
                {request.borrowerName}
              </CardTitle>
              <p className="text-sm text-gray-500">ID: {request.id}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(request.status)} border font-medium`}>
            {getStatusText(request.status)}
          </Badge>
        </div>
        <div className="text-3xl font-bold text-brand-600 bg-brand-50 p-4 rounded-xl text-center">
          {formatCurrency(request.amount)} đ
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-1">Mục đích:</p>
          <p className="text-sm text-gray-600 font-medium">{request.purpose}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-gray-700 mb-1">Thời hạn:</p>
            <p className="text-gray-600 font-medium">{request.term} tháng</p>
          </div>
          <div className={`p-3 rounded-lg ${getCreditScoreColor(request.creditScore)}`}>
            <p className="font-semibold mb-1">Điểm tín dụng:</p>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg">{request.creditScore}</span>
              <TrendingUp className="h-3 w-3" />
            </div>
            <p className="text-xs font-medium opacity-75">
              {getCreditScoreLabel(request.creditScore)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-brand-500" />
            <span className="font-medium">{request.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-brand-500" />
            <span className="font-medium">Đăng ngày {new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MessageCircle className="h-4 w-4 text-brand-500" />
            <span className="font-medium text-brand-600">{request.offers} lời đề nghị</span>
            {request.offers > 0 && <Badge variant="secondary" className="text-xs bg-brand-100 text-brand-700">Hot</Badge>}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {request.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          className="w-full bg-brand-600 hover:bg-brand-700 font-semibold py-3 group"
          disabled={request.status === 'closed'}
        >
          {request.status === 'closed' ? 'Đã đóng' : 'Gửi đề nghị'}
          {request.status !== 'closed' && (
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanRequestCard;
