import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  X, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  Info
} from 'lucide-react';
import { cicService } from '@/services/cic-service';
import { CustomerWarning } from '@/types/cic';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EnhancedCICWarningSystem = () => {
  const { user } = useAuth();
  const [warnings, setWarnings] = useState<CustomerWarning[]>([]);
  const [cicHistory, setCicHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cicInsights, setCicInsights] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [warningsData, historyData, insightsData] = await Promise.all([
        cicService.getCustomerWarnings(user.id),
        loadCICHistory(),
        checkCICImpact()
      ]);
      
      setWarnings(warningsData);
      setCicHistory(historyData);
      setCicInsights(insightsData);
    } catch (error) {
      console.error('Error loading CIC data:', error);
      toast.error('Không thể tải thông tin CIC');
    } finally {
      setLoading(false);
    }
  };

  const loadCICHistory = async () => {
    // Mock CIC history data
    return [
      {
        id: '1',
        bank_name: 'VietcomBank',
        check_date: '2024-01-15',
        purpose: 'Đánh giá vay thế chấp',
        impact_score: 5
      },
      {
        id: '2',
        bank_name: 'TechcomBank',
        check_date: '2024-02-20',
        purpose: 'Đánh giá thẻ tín dụng',
        impact_score: 3
      }
    ];
  };

  const checkCICImpact = async () => {
    // Mock CIC impact analysis
    return {
      recent_checks: 2,
      total_checks: 4,
      impact_level: 'medium',
      can_safely_check: true,
      warning_message: 'Bạn đã có 2 lần kiểm tra CIC trong 3 tháng qua. Hãy cân nhắc kỹ trước khi cho phép thêm ngân hàng kiểm tra.',
      score_impact: -15,
      recovery_time: '3-6 tháng'
    };
  };

  const handleAcknowledge = async (warningId: string) => {
    try {
      await cicService.acknowledgeWarning(warningId);
      setWarnings(prev => prev.filter(w => w.id !== warningId));
      toast.success('Đã xác nhận cảnh báo');
    } catch (error) {
      console.error('Error acknowledging warning:', error);
      toast.error('Không thể xác nhận cảnh báo');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getImpactLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return <div className="text-center p-4">Đang tải thông tin CIC...</div>;
  }

  return (
    <div className="space-y-6">
      {/* CIC Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Tình trạng CIC của bạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cicInsights && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{cicInsights.recent_checks}</div>
                  <div className="text-sm text-blue-500">Kiểm tra gần đây (3 tháng)</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{cicInsights.total_checks}</div>
                  <div className="text-sm text-purple-500">Tổng số lần kiểm tra (12 tháng)</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getImpactLevelColor(cicInsights.impact_level)}`}>
                    {getImpactLevelText(cicInsights.impact_level)}
                  </div>
                  <div className="text-sm text-green-500">Mức độ tác động</div>
                </div>
              </div>

              {cicInsights.score_impact && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Tác động lên điểm tín dụng</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Điểm tín dụng có thể giảm {Math.abs(cicInsights.score_impact)} điểm.
                    Thời gian phục hồi: {cicInsights.recovery_time}
                  </p>
                </div>
              )}

              <div className={`p-4 rounded-lg ${cicInsights.can_safely_check ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {cicInsights.can_safely_check ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`font-medium ${cicInsights.can_safely_check ? 'text-green-800' : 'text-red-800'}`}>
                    {cicInsights.can_safely_check ? 'An toàn để kiểm tra' : 'Nên tránh kiểm tra thêm'}
                  </span>
                </div>
                <p className={`text-sm ${cicInsights.can_safely_check ? 'text-green-700' : 'text-red-700'}`}>
                  {cicInsights.warning_message}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Cảnh báo quan trọng</h3>
          {warnings.map((warning) => (
            <Alert key={warning.id} className={getSeverityColor(warning.severity)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <p className="font-medium mb-1">
                    {warning.severity === 'high' && 'Cảnh báo nghiêm trọng'}
                    {warning.severity === 'medium' && 'Cảnh báo quan trọng'}
                    {warning.severity === 'low' && 'Thông tin'}
                  </p>
                  <p>{warning.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAcknowledge(warning.id)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* CIC History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch sử kiểm tra CIC
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cicHistory.length > 0 ? (
            <div className="space-y-3">
              {cicHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{record.bank_name}</div>
                    <div className="text-sm text-muted-foreground">{record.purpose}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(record.check_date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <Badge variant="outline" className={record.impact_score > 5 ? 'text-red-600' : 'text-green-600'}>
                    Tác động: {record.impact_score} điểm
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Chưa có lịch sử kiểm tra CIC
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Lời khuyên bảo vệ điểm tín dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Hạn chế số lần kiểm tra CIC</p>
                <p className="text-sm text-muted-foreground">
                  Chỉ nên cho phép kiểm tra CIC khi thực sự cần thiết và có ý định vay
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Theo dõi điểm tín dụng định kỳ</p>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra điểm tín dụng thường xuyên để phát hiện sớm các vấn đề
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Thanh toán đúng hạn</p>
                <p className="text-sm text-muted-foreground">
                  Luôn thanh toán các khoản vay và thẻ tín dụng đúng hạn
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCICWarningSystem;