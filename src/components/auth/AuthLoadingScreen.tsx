
import LoadingSpinner from '@/components/ui/loading-spinner';
import { CheckCircle, Shield, Users } from 'lucide-react';

const AuthLoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 to-white">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-100">
          <div className="bg-brand-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-brand-600" />
          </div>
          
          <LoadingSpinner size="lg" className="mx-auto mb-6" />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Đang xác thực tài khoản
          </h2>
          
          <p className="text-gray-600 mb-6">
            Vui lòng chờ trong giây lát để chúng tôi xác minh thông tin của bạn
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Bảo mật thông tin cá nhân</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="h-4 w-4 text-green-500" />
              <span>Kết nối với tư vấn viên chuyên nghiệp</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Trải nghiệm an toàn và minh bạch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
