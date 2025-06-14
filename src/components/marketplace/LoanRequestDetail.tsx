
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock, User, TrendingUp, MessageCircle, Phone, Mail, Building, Calendar, CreditCard, Target, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
    phone?: string;
    email?: string;
    rating?: number;
    experience?: string;
  };
  borrowerProfile?: {
    monthlyIncome: number;
    employmentType: string;
    workExperience: number;
    currentDebts: number;
    assets: string[];
  };
  documents?: {
    name: string;
    status: 'pending' | 'verified' | 'rejected';
    uploadedAt: string;
  }[];
}

interface LoanRequestDetailProps {
  request: LoanRequest;
  onClose: () => void;
}

const LoanRequestDetail = ({ request, onClose }: LoanRequestDetailProps) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'in_negotiation':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
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

  const handleApplyAsAdvisor = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để ứng tuyển làm tư vấn viên.",
        variant: "destructive",
      });
      return;
    }

    if (userRole !== 'advisor') {
      toast({
        title: "Không đủ quyền",
        description: "Chỉ tư vấn viên mới có thể ứng tuyển cho yêu cầu này.",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Ứng tuyển thành công",
        description: "Bạn đã gửi đề nghị tư vấn. Khách hàng sẽ được thông báo.",
      });
      setIsApplying(false);
    }, 1500);
  };

  const handleContactAdvisor = () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để liên hệ với tư vấn viên.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Chuyển hướng đến tin nhắn",
      description: `Bạn sẽ được chuyển đến trang tin nhắn để liên hệ với ${request.assignedAdvisor?.name}.`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết yêu cầu vay</h2>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white p-4 rounded-xl">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{request.borrowerName}</h3>
                <p className="text-gray-500">ID: {request.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-brand-500" />
                  <span className="text-sm text-gray-600">{request.location}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(request.status)} text-sm font-medium px-3 py-1`}>
              {getStatusText(request.status)}
            </Badge>
          </div>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-600" />
                Thông tin khoản vay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-brand-50 rounded-lg">
                  <div className="text-2xl font-bold text-brand-600">
                    {formatCurrency(request.amount)} đ
                  </div>
                  <p className="text-sm text-brand-700 font-medium">Số tiền cần vay</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-700">
                    {request.term} tháng
                  </div>
                  <p className="text-sm text-gray-600">Thời hạn vay</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-700">
                    {request.creditScore}
                  </div>
                  <p className="text-sm text-gray-600">Điểm tín dụng</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-brand-500" />
                  <span className="font-medium">Mục đích:</span>
                  <Badge variant="secondary" className="bg-brand-100 text-brand-700">
                    {request.purpose}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-500" />
                  <span className="font-medium">Ngày đăng:</span>
                  <span className="text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-500" />
                  <span className="font-medium">Số lời đề nghị:</span>
                  <span className="text-gray-600">{request.offers}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Mô tả chi tiết:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Borrower Profile */}
          {request.borrowerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-600" />
                  Hồ sơ người vay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thu nhập hàng tháng:</span>
                      <span className="font-medium">{formatCurrency(request.borrowerProfile.monthlyIncome)} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại hình công việc:</span>
                      <span className="font-medium">{request.borrowerProfile.employmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kinh nghiệm làm việc:</span>
                      <span className="font-medium">{request.borrowerProfile.workExperience} năm</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nợ hiện tại:</span>
                      <span className="font-medium">{formatCurrency(request.borrowerProfile.currentDebts)} đ</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tài sản:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {request.borrowerProfile.assets.map((asset, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Advisor */}
          {request.assignedAdvisor && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-brand-600" />
                  Tư vấn viên được phân công
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={request.assignedAdvisor.avatar} alt={request.assignedAdvisor.name} />
                    <AvatarFallback className="bg-brand-600 text-white text-lg">
                      {request.assignedAdvisor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{request.assignedAdvisor.name}</h4>
                    <p className="text-brand-600 font-medium">{request.assignedAdvisor.title}</p>
                    {request.assignedAdvisor.experience && (
                      <p className="text-sm text-gray-600 mt-1">{request.assignedAdvisor.experience}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      {request.assignedAdvisor.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{request.assignedAdvisor.phone}</span>
                        </div>
                      )}
                      {request.assignedAdvisor.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{request.assignedAdvisor.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {request.assignedAdvisor.rating && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {request.assignedAdvisor.rating}
                      </div>
                      <div className="text-xs text-gray-500">⭐ Rating</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {request.documents && request.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-600" />
                  Tài liệu đã nộp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {request.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{doc.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                        </span>
                        <Badge 
                          variant={doc.status === 'verified' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {doc.status === 'verified' ? 'Đã xác minh' : 
                           doc.status === 'rejected' ? 'Bị từ chối' : 'Đang chờ'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {userRole === 'advisor' && !request.assignedAdvisor && request.status === 'open' && (
              <Button 
                onClick={handleApplyAsAdvisor}
                disabled={isApplying}
                className="flex-1 bg-brand-600 hover:bg-brand-700"
              >
                {isApplying ? 'Đang gửi...' : 'Ứng tuyển làm tư vấn viên'}
              </Button>
            )}
            
            {request.assignedAdvisor && userRole === 'customer' && (
              <Button 
                onClick={handleContactAdvisor}
                className="flex-1 bg-brand-600 hover:bg-brand-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Nhắn tin với tư vấn viên
              </Button>
            )}

            {userRole === 'customer' && !request.assignedAdvisor && request.status === 'open' && (
              <div className="flex-1 text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Yêu cầu của bạn đang chờ tư vấn viên ứng tuyển
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRequestDetail;
