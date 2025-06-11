
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, RefreshCw, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OptimizationAlert {
  id: string;
  existing_loan_id: string;
  alert_type: string;
  alert_data: any;
  is_active: boolean;
  triggered_at: string;
  read_at: string | null;
  created_at: string;
  existing_loans?: {
    bank_name: string;
    loan_type: string;
  };
}

const OptimizationAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<OptimizationAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_optimization_alerts')
        .select(`
          *,
          existing_loans (
            bank_name,
            loan_type
          )
        `)
        .order('triggered_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải cảnh báo tối ưu hóa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('loan_optimization_alerts')
        .update({ read_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, read_at: new Date().toISOString() }
          : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('loan_optimization_alerts')
        .update({ is_active: false })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast({
        title: "Đã ẩn cảnh báo",
        description: "Cảnh báo đã được ẩn khỏi danh sách",
      });
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'rate_drop':
        return <TrendingDown className="h-5 w-5 text-green-500" />;
      case 'better_terms':
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case 'refinance_opportunity':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertTitle = (alertType: string) => {
    switch (alertType) {
      case 'rate_drop':
        return 'Lãi suất giảm';
      case 'better_terms':
        return 'Điều kiện tốt hơn';
      case 'refinance_opportunity':
        return 'Cơ hội tái cấu trúc';
      default:
        return 'Cảnh báo tối ưu hóa';
    }
  };

  const getAlertVariant = (alertType: string) => {
    switch (alertType) {
      case 'rate_drop':
        return 'default';
      case 'better_terms':
        return 'secondary';
      case 'refinance_opportunity':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">
            Vui lòng đăng nhập để xem cảnh báo tối ưu hóa
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(alert => alert.is_active);
  const unreadAlerts = activeAlerts.filter(alert => !alert.read_at);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Cảnh báo tối ưu hóa ({activeAlerts.length})
          </h2>
          {unreadAlerts.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {unreadAlerts.length} cảnh báo chưa đọc
            </p>
          )}
        </div>
        <Button onClick={fetchAlerts} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {activeAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không có cảnh báo nào
            </h3>
            <p className="text-gray-500">
              Hệ thống sẽ thông báo khi có cơ hội tối ưu hóa khoản vay
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`${!alert.read_at ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.alert_type)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">
                          {getAlertTitle(alert.alert_type)}
                        </CardTitle>
                        <Badge variant={getAlertVariant(alert.alert_type)}>
                          {alert.existing_loans?.bank_name} - {alert.existing_loans?.loan_type}
                        </Badge>
                        {!alert.read_at && (
                          <Badge variant="destructive" className="text-xs">
                            Mới
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {alert.alert_data?.message || 'Có cơ hội tối ưu hóa khoản vay của bạn'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.read_at && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {alert.alert_data?.details && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Chi tiết:</h5>
                      <p className="text-sm text-gray-700">{alert.alert_data.details}</p>
                    </div>
                  )}

                  {alert.alert_data?.action_items && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Hành động được đề xuất:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {alert.alert_data.action_items.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Thời gian: {new Date(alert.triggered_at).toLocaleString('vi-VN')}
                    </span>
                    {alert.alert_data?.priority && (
                      <Badge variant="outline" className="text-xs">
                        Mức độ: {alert.alert_data.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptimizationAlerts;
