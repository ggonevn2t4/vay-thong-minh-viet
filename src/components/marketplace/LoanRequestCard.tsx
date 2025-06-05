
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock, Star, MessageCircle } from 'lucide-react';

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
        return 'bg-green-100 text-green-800';
      case 'in_negotiation':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {request.borrowerName}
          </CardTitle>
          <Badge className={getStatusColor(request.status)}>
            {getStatusText(request.status)}
          </Badge>
        </div>
        <div className="text-2xl font-bold text-brand-600">
          {formatCurrency(request.amount)} đ
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Mục đích:</p>
          <p className="text-sm text-gray-600">{request.purpose}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium text-gray-700">Thời hạn:</p>
            <p className="text-gray-600">{request.term} tháng</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Điểm tín dụng:</p>
            <p className={`font-semibold ${getCreditScoreColor(request.creditScore)}`}>
              {request.creditScore}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{request.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Đăng ngày {new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle className="h-4 w-4" />
          <span>{request.offers} lời đề nghị</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {request.description}
        </p>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          className="w-full bg-brand-600 hover:bg-brand-700"
          disabled={request.status === 'closed'}
        >
          {request.status === 'closed' ? 'Đã đóng' : 'Gửi đề nghị'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanRequestCard;
