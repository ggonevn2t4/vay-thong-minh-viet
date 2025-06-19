
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Eye } from 'lucide-react';
import { CICImpactResult } from '@/types/cic';

interface CICConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consent: boolean) => void;
  bankName: string;
  impactData?: CICImpactResult;
  loading?: boolean;
}

const CICConsentModal = ({ 
  isOpen, 
  onClose, 
  onConsent, 
  bankName, 
  impactData,
  loading 
}: CICConsentModalProps) => {
  const [understood, setUnderstood] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const canProceed = understood && agreedToTerms && !loading;

  const handleConsent = (consent: boolean) => {
    onConsent(consent);
    setUnderstood(false);
    setAgreedToTerms(false);
  };

  const getSeverityColor = (level?: string) => {
    switch (level) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Xin phép kiểm tra thông tin tín dụng CIC
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {bankName} muốn kiểm tra thông tin tín dụng của bạn
            </h4>
            <p className="text-sm text-gray-700">
              Để đánh giá khả năng tín dụng và đưa ra đề nghị vay phù hợp, {bankName} cần truy cập 
              thông tin tín dụng từ Trung tâm Thông tin Tín dụng Quốc gia (CIC).
            </p>
          </div>

          {impactData && (
            <Alert className={getSeverityColor(impactData.impact_level)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Tác động đến điểm tín dụng:</p>
                  <p>{impactData.warning_message}</p>
                  <div className="text-sm space-y-1">
                    <p>• Số lần kiểm tra gần đây (3 tháng): {impactData.recent_checks}</p>
                    <p>• Tổng số lần kiểm tra (12 tháng): {impactData.total_checks}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium mb-3">Những điều bạn cần biết:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-500">•</span>
                Việc kiểm tra CIC sẽ được ghi nhận trong hồ sơ tín dụng của bạn
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-500">•</span>
                Nhiều lần kiểm tra trong thời gian ngắn có thể ảnh hưởng đến điểm tín dụng
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-500">•</span>
                Thông tin sẽ chỉ được sử dụng để đánh giá đơn vay này
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-500">•</span>
                Bạn có quyền từ chối và không bị ảnh hưởng đến các dịch vụ khác
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="understood" 
                checked={understood}
                onCheckedChange={(checked) => setUnderstood(checked as boolean)}
              />
              <label htmlFor="understood" className="text-sm">
                Tôi hiểu rõ tác động của việc kiểm tra CIC đến điểm tín dụng của mình
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="agreed" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label htmlFor="agreed" className="text-sm">
                Tôi đồng ý cho {bankName} kiểm tra thông tin tín dụng CIC của tôi
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleConsent(false)}>
            Từ chối
          </Button>
          <Button 
            onClick={() => handleConsent(true)}
            disabled={!canProceed}
          >
            {loading ? 'Đang xử lý...' : 'Đồng ý'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CICConsentModal;
