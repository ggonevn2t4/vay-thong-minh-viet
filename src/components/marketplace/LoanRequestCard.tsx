
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock, User, TrendingUp, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

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
  assignedAdvisor?: {
    name: string;
    avatar?: string;
    title: string;
  };
}

interface LoanRequestCardProps {
  request: LoanRequest;
}

const LoanRequestCard = ({ request }: LoanRequestCardProps) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

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

  const handleContactAdvisor = () => {
    if (isSignedIn) {
      navigate('/messages');
    } else {
      // Redirect to sign in
      navigate('/');
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white p-3 rounded-xl">
              <User className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
                {request.borrowerName}
              </CardTitle>
              <p className="text-sm text-gray-500">ID: {request.id}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(request.status)} font-medium`}>
            {getStatusText(request.status)}
          </Badge>
        </div>

        {/* Assigned Advisor Section */}
        {request.assignedAdvisor && (
          <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.assignedAdvisor.avatar} alt={request.assignedAdvisor.name} />
              <AvatarFallback className="bg-brand-600 text-white">
                {request.assignedAdvisor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{request.assignedAdvisor.name}</p>
              <p className="text-xs text-brand-600">{request.assignedAdvisor.title}</p>
            </div>
            <TrendingUp className="h-4 w-4 text-brand-500" />
          </div>
        )}

        <Badge variant="secondary" className="w-fit bg-brand-100 text-brand-700 font-medium">
          {request.purpose}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="text-center p-6 bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl border border-brand-200">
          <div className="text-3xl font-bold text-brand-600 mb-1">
            {formatCurrency(request.amount)} đ
          </div>
          <p className="text-sm text-brand-700 font-medium">Số tiền cần vay</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-gray-700 mb-1">Thời hạn:</p>
            <p className="text-gray-600 font-medium">{request.term} tháng</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-gray-700 mb-1">Điểm tín dụng:</p>
            <p className={`font-bold ${getCreditScoreColor(request.creditScore)}`}>
              {request.creditScore}
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
            <span className="font-medium">
              Đăng {new Date(request.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 text-brand-500" />
            <span className="font-medium">{request.offers} lời đề nghị</span>
          </div>
        </div>

        <div>
          <p className="font-semibold text-gray-700 text-sm mb-2">Mô tả:</p>
          <p className="text-sm text-gray-600 line-clamp-3">{request.description}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-4 space-y-3">
        <Button className="w-full bg-brand-600 hover:bg-brand-700 font-semibold py-3 group">
          Xem chi tiết
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        {request.assignedAdvisor && (
          <Button 
            variant="outline" 
            className="w-full border-brand-200 text-brand-600 hover:bg-brand-50 font-medium py-3"
            onClick={handleContactAdvisor}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Nhắn tin với tư vấn viên
          </Button>
        )}
        
        {!request.assignedAdvisor && request.status === 'open' && (
          <Button variant="outline" className="w-full border-brand-200 text-brand-600 hover:bg-brand-50 font-medium py-3">
            Đề nghị tư vấn
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LoanRequestCard;
