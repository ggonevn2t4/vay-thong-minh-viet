
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { cicService } from '@/services/cic-service';
import { CustomerWarning } from '@/types/cic';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CustomerWarnings = () => {
  const { user } = useAuth();
  const [warnings, setWarnings] = useState<CustomerWarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWarnings();
    }
  }, [user]);

  const loadWarnings = async () => {
    if (!user) return;
    
    try {
      const data = await cicService.getCustomerWarnings(user.id);
      setWarnings(data);
    } catch (error) {
      console.error('Error loading warnings:', error);
      toast.error('Không thể tải cảnh báo');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div className="text-center p-4">Đang tải cảnh báo...</div>;
  }

  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
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
  );
};

export default CustomerWarnings;
