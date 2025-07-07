import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X,
  Eye,
  Download,
  Share2,
  RefreshCw,
  MessageSquare,
  Calendar,
  Users,
  Building,
  Shield,
  FileText,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface LegalDocumentStatusProps {
  onApprovalComplete: () => void;
}

const LegalDocumentStatus: React.FC<LegalDocumentStatusProps> = ({ 
  onApprovalComplete 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real app, this would come from API
  const sharingStatus = {
    totalShared: 5,
    approved: 3,
    pending: 2,
    rejected: 0,
    lastUpdate: new Date().toISOString()
  };

  const sharedDocuments = [
    {
      id: '1',
      name: 'Chứng minh nhân dân',
      category: 'identity',
      sharedWith: 'Vietcombank',
      sharedAt: '2024-01-15T10:30:00Z',
      status: 'approved',
      reviewedBy: 'Nguyễn Văn A - Chuyên viên tín dụng',
      reviewedAt: '2024-01-16T14:20:00Z',
      comments: 'Tài liệu hợp lệ, thông tin chính xác',
      accessCount: 3,
      expiresAt: '2024-01-22T10:30:00Z'
    },
    {
      id: '2',
      name: 'Bảng lương 3 tháng',
      category: 'income',
      sharedWith: 'Vietcombank',
      sharedAt: '2024-01-15T10:30:00Z',
      status: 'approved',
      reviewedBy: 'Trần Thị B - Chuyên viên tín dụng',
      reviewedAt: '2024-01-16T15:45:00Z',
      comments: 'Thu nhập ổn định, đáp ứng yêu cầu',
      accessCount: 2,
      expiresAt: '2024-01-22T10:30:00Z'
    },
    {
      id: '3',
      name: 'Sao kê ngân hàng',
      category: 'bank_statement',
      sharedWith: 'Vietcombank',
      sharedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null,
      comments: null,
      accessCount: 1,
      expiresAt: '2024-01-22T10:30:00Z'
    },
    {
      id: '4',
      name: 'Hợp đồng lao động',
      category: 'income',
      sharedWith: 'Nguyễn Văn C - Tư vấn viên',
      sharedAt: '2024-01-15T11:00:00Z',
      status: 'approved',
      reviewedBy: 'Nguyễn Văn C',
      reviewedAt: '2024-01-15T16:30:00Z',
      comments: 'Hợp đồng có thời hạn dài, ổn định',
      accessCount: 1,
      expiresAt: '2024-01-22T11:00:00Z'
    },
    {
      id: '5',
      name: 'Giấy chứng nhận thu nhập',
      category: 'income',
      sharedWith: 'Techcombank',
      sharedAt: '2024-01-16T09:15:00Z',
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null,
      comments: null,
      accessCount: 0,
      expiresAt: '2024-01-23T09:15:00Z'
    }
  ];

  const notifications = [
    {
      id: '1',
      type: 'approval',
      title: 'Tài liệu được phê duyệt',
      message: 'Chứng minh nhân dân đã được Vietcombank phê duyệt',
      timestamp: '2024-01-16T14:20:00Z',
      read: false
    },
    {
      id: '2',
      type: 'access',
      title: 'Tài liệu được truy cập',
      message: 'Sao kê ngân hàng đã được xem bởi Vietcombank',
      timestamp: '2024-01-16T10:45:00Z',
      read: false
    },
    {
      id: '3',
      type: 'approval',
      title: 'Tài liệu được phê duyệt',
      message: 'Bảng lương 3 tháng đã được Vietcombank phê duyệt',
      timestamp: '2024-01-16T15:45:00Z',
      read: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return X;
      default: return AlertTriangle;
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Đã cập nhật trạng thái mới nhất');
  };

  const approvalProgress = (sharingStatus.approved / sharingStatus.totalShared) * 100;
  const isCompleted = sharingStatus.approved === sharingStatus.totalShared;

  if (isCompleted) {
    onApprovalComplete();
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Tình trạng phê duyệt tài liệu
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Cập nhật
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sharingStatus.totalShared}</div>
              <div className="text-sm text-blue-700">Tổng tài liệu</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sharingStatus.approved}</div>
              <div className="text-sm text-green-700">Đã phê duyệt</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{sharingStatus.pending}</div>
              <div className="text-sm text-yellow-700">Đang chờ</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{sharingStatus.rejected}</div>
              <div className="text-sm text-red-700">Bị từ chối</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Tiến độ phê duyệt</span>
              <span className="font-semibold">{Math.round(approvalProgress)}%</span>
            </div>
            <Progress value={approvalProgress} className="h-2" />
            {isCompleted ? (
              <p className="text-green-600 text-sm font-medium mt-2">
                ✓ Tất cả tài liệu đã được phê duyệt
              </p>
            ) : (
              <p className="text-gray-600 text-sm mt-2">
                Còn {sharingStatus.pending} tài liệu đang chờ phê duyệt
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Status List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Chi tiết trạng thái tài liệu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sharedDocuments.map((doc) => {
              const StatusIcon = getStatusIcon(doc.status);
              const isExpiringSoon = new Date(doc.expiresAt) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
              
              return (
                <div
                  key={doc.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{doc.name}</h3>
                        <Badge variant="outline" className={getStatusColor(doc.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {doc.status === 'approved' && 'Đã duyệt'}
                          {doc.status === 'pending' && 'Chờ duyệt'}
                          {doc.status === 'rejected' && 'Từ chối'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Chia sẻ với: {doc.sharedWith}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(doc.sharedAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {doc.accessCount} lượt xem
                        </div>
                      </div>
                    </div>
                    
                    {isExpiringSoon && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Sắp hết hạn
                      </Badge>
                    )}
                  </div>

                  {doc.status === 'approved' && doc.comments && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-800">{doc.comments}</p>
                          {doc.reviewedBy && (
                            <p className="text-xs text-green-600 mt-1">
                              - {doc.reviewedBy} • {new Date(doc.reviewedAt!).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {doc.status === 'pending' && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm text-yellow-800">
                          Tài liệu đang được xem xét. Thời gian xử lý dự kiến: 1-2 ngày làm việc.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      Hết hạn: {new Date(doc.expiresAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            Thông báo gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'approval' 
                    ? 'border-l-green-500 bg-green-50' 
                    : 'border-l-blue-500 bg-blue-50'
                } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      {isCompleted && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>Hoàn tất!</strong> Tất cả tài liệu pháp lý đã được phê duyệt. 
            Bạn có thể tiếp tục với các bước tiếp theo trong quy trình vay vốn.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <strong>Bảo mật:</strong> Tất cả hoạt động truy cập tài liệu được ghi lại và theo dõi. 
          Bạn sẽ nhận được thông báo khi có người truy cập tài liệu của mình.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LegalDocumentStatus;