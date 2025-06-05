
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SystemAlert = () => {
  return (
    <Alert className="border-blue-200 bg-blue-50">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        Hệ thống đang hoạt động bình thường. Tất cả dữ liệu được cập nhật trong thời gian thực.
      </AlertDescription>
    </Alert>
  );
};

export default SystemAlert;
