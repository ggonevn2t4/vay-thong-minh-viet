import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import LegalDocumentUpload from '@/components/legal-document-flow/LegalDocumentUpload';
import LegalDocumentSharing from '@/components/legal-document-flow/LegalDocumentSharing';
import LegalDocumentReview from '@/components/legal-document-flow/LegalDocumentReview';
import LegalDocumentStatus from '@/components/legal-document-flow/LegalDocumentStatus';
import { 
  FileText, 
  Share2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Shield,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LegalDocumentFlow = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [flowProgress, setFlowProgress] = useState(25);

  const flowSteps = [
    {
      id: 'upload',
      title: 'Tải tài liệu',
      description: 'Tải lên các tài liệu pháp lý cần thiết',
      icon: FileText,
      status: 'completed'
    },
    {
      id: 'review',
      title: 'Xem xét tài liệu',
      description: 'Kiểm tra và xác thực tài liệu',
      icon: Eye,
      status: 'in_progress'
    },
    {
      id: 'sharing',
      title: 'Chia sẻ tài liệu',
      description: 'Chia sẻ tài liệu với ngân hàng/tư vấn viên',
      icon: Share2,
      status: 'pending'
    },
    {
      id: 'approval',
      title: 'Phê duyệt',
      description: 'Chờ phê duyệt từ ngân hàng',
      icon: CheckCircle,
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'pending': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Quy trình tài liệu pháp lý
              </h1>
              <p className="text-lg text-gray-600">
                Quản lý và chia sẻ tài liệu pháp lý một cách an toàn và hiệu quả
              </p>
            </div>

            {/* Progress Overview */}
            <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Tiến độ quy trình
                  </CardTitle>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {flowProgress}% hoàn thành
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={flowProgress} className="mb-6 h-2" />
                
                {/* Flow Steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {flowSteps.map((step, index) => {
                    const Icon = step.icon;
                    const StatusIcon = getStatusIcon(step.status);
                    return (
                      <div
                        key={step.id}
                        className={`relative p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                          activeTab === step.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab(step.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(step.status)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900">
                              {step.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {step.description}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <StatusIcon className="h-3 w-3" />
                              <span className="text-xs capitalize font-medium">
                                {step.status === 'in_progress' && 'Đang xử lý'}
                                {step.status === 'completed' && 'Hoàn thành'}
                                {step.status === 'pending' && 'Chờ xử lý'}
                                {step.status === 'rejected' && 'Bị từ chối'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tải tài liệu
                </TabsTrigger>
                <TabsTrigger value="review" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Xem xét
                </TabsTrigger>
                <TabsTrigger value="sharing" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Trạng thái
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <LegalDocumentUpload 
                  onUploadComplete={() => setFlowProgress(50)}
                  onNext={() => setActiveTab('review')}
                />
              </TabsContent>

              <TabsContent value="review" className="space-y-6">
                <LegalDocumentReview 
                  onReviewComplete={() => setFlowProgress(75)}
                  onNext={() => setActiveTab('sharing')}
                />
              </TabsContent>

              <TabsContent value="sharing" className="space-y-6">
                <LegalDocumentSharing 
                  onSharingComplete={() => setFlowProgress(90)}
                  onNext={() => setActiveTab('status')}
                />
              </TabsContent>

              <TabsContent value="status" className="space-y-6">
                <LegalDocumentStatus 
                  onApprovalComplete={() => setFlowProgress(100)}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Security Notice */}
          <div className="max-w-6xl mx-auto mt-12">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">
                      Bảo mật và quyền riêng tư
                    </h3>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Tất cả tài liệu pháp lý của bạn được mã hóa và bảo vệ theo tiêu chuẩn ngân hàng. 
                      Chỉ những người được ủy quyền mới có thể truy cập tài liệu của bạn. 
                      Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LegalDocumentFlow;