
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Full URL:",
      window.location.href
    );
  }, [location.pathname]);

  const commonRoutes = [
    { path: "/", label: "Trang chủ", icon: <Home className="h-4 w-4" /> },
    { path: "/marketplace", label: "Sàn giao dịch" },
    { path: "/loan-application", label: "Đăng ký vay" },
    { path: "/loan-eligibility", label: "Kiểm tra điều kiện vay" },
    { path: "/so-sanh", label: "So sánh lãi suất" },
    { path: "/advisor-directory", label: "Tư vấn viên" },
    { path: "/about", label: "Về chúng tôi" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            404 - Không tìm thấy trang
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
            </p>
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md font-mono">
              Đường dẫn: {location.pathname}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Các trang phổ biến:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {route.icon && route.icon}
                  <span className="text-gray-700 hover:text-blue-600">
                    {route.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            
            <Link to="/" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với chúng tôi qua{" "}
              <span className="font-semibold text-blue-600">0765080960</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
