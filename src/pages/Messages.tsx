
import Layout from '@/components/layout/Layout';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Shield } from 'lucide-react';
import PageSkeleton from '@/components/ui/page-skeleton';
import { Link } from 'react-router-dom';

const Messages = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <PageSkeleton type="list" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="bg-brand-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-brand-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Đăng nhập để sử dụng tính năng tin nhắn
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Kết nối với tư vấn viên chuyên nghiệp và nhận hỗ trợ trực tiếp cho nhu cầu vay vốn của bạn
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 text-center">
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 text-brand-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Tư vấn 1:1</h3>
                    <p className="text-sm text-gray-600">Được hỗ trợ trực tiếp từ chuyên gia</p>
                  </CardContent>
                </Card>
                <Card className="p-6 text-center">
                  <CardContent className="pt-6">
                    <MessageCircle className="h-8 w-8 text-brand-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Tin nhắn thời gian thực</h3>
                    <p className="text-sm text-gray-600">Nhận phản hồi nhanh chóng</p>
                  </CardContent>
                </Card>
                <Card className="p-6 text-center">
                  <CardContent className="pt-6">
                    <Shield className="h-8 w-8 text-brand-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">An toàn & Bảo mật</h3>
                    <p className="text-sm text-gray-600">Thông tin được bảo vệ tuyệt đối</p>
                  </CardContent>
                </Card>
              </div>
              
              <Link to="/auth">
                <Button size="lg" className="bg-brand-600 hover:bg-brand-700 px-8 py-3">
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tin nhắn</h1>
            <p className="text-gray-600">
              Trao đổi trực tiếp với tư vấn viên và khách hàng
            </p>
          </div>
          
          <MessagingInterface />
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
