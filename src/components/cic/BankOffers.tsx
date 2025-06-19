
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { cicService } from '@/services/cic-service';
import { BankLoanOffer } from '@/types/cic';
import { formatCurrency } from '@/utils/loan-application-utils';
import { toast } from 'sonner';

interface BankOffersProps {
  applicationId: string;
  onOfferAccepted?: (offer: BankLoanOffer) => void;
}

const BankOffers = ({ applicationId, onOfferAccepted }: BankOffersProps) => {
  const [offers, setOffers] = useState<BankLoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadOffers();
  }, [applicationId]);

  const loadOffers = async () => {
    try {
      const data = await cicService.getBankOffers(applicationId);
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast.error('Không thể tải đề nghị từ ngân hàng');
    } finally {
      setLoading(false);
    }
  };

  const generateOffers = async () => {
    setGenerating(true);
    try {
      const result = await cicService.generateBankOffers(applicationId);
      if (result.success) {
        toast.success(result.message);
        loadOffers();
      }
    } catch (error) {
      console.error('Error generating offers:', error);
      toast.error('Không thể tạo đề nghị từ ngân hàng');
    } finally {
      setGenerating(false);
    }
  };

  const handleOfferAction = async (offerId: string, status: 'accepted' | 'declined') => {
    try {
      await cicService.updateOfferStatus(offerId, status);
      
      const updatedOffers = offers.map(offer => 
        offer.id === offerId ? { ...offer, status } : offer
      );
      setOffers(updatedOffers);

      if (status === 'accepted') {
        const acceptedOffer = offers.find(o => o.id === offerId);
        if (acceptedOffer && onOfferAccepted) {
          onOfferAccepted(acceptedOffer);
        }
        toast.success('Đã chấp nhận đề nghị');
      } else {
        toast.success('Đã từ chối đề nghị');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Không thể cập nhật đề nghị');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Đã chấp nhận';
      case 'declined': return 'Đã từ chối';
      case 'expired': return 'Đã hết hạn';
      default: return 'Chờ phản hồi';
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="text-center p-6">Đang tải đề nghị...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Đề nghị từ các ngân hàng</h3>
        {offers.length === 0 && (
          <Button onClick={generateOffers} disabled={generating}>
            {generating ? 'Đang tạo...' : 'Tạo đề nghị'}
          </Button>
        )}
      </div>

      {offers.length === 0 && !generating && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">Chưa có đề nghị nào từ ngân hàng</p>
            <Button onClick={generateOffers}>Tạo đề nghị từ ngân hàng</Button>
          </CardContent>
        </Card>
      )}

      {offers.map((offer) => {
        const expired = isExpired(offer.offer_expires_at);
        return (
          <Card key={offer.id} className={expired ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{offer.bank_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(expired ? 'expired' : offer.status)}
                    <Badge variant="outline">
                      {getStatusText(expired ? 'expired' : offer.status)}
                    </Badge>
                  </div>
                </div>
                {offer.requires_cic_check && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Yêu cầu kiểm tra CIC
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Số tiền đề nghị</p>
                  <p className="font-semibold text-lg">{formatCurrency(offer.offered_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lãi suất</p>
                  <p className="font-semibold text-lg">{offer.interest_rate}%/năm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời hạn</p>
                  <p className="font-semibold">{offer.term_months} tháng</p>
                </div>
                {offer.offer_expires_at && (
                  <div>
                    <p className="text-sm text-gray-500">Hết hạn</p>
                    <p className="font-semibold">
                      {new Date(offer.offer_expires_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>

              {offer.conditions && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Điều kiện</p>
                  <p className="text-sm">{offer.conditions}</p>
                </div>
              )}

              {offer.status === 'pending' && !expired && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleOfferAction(offer.id, 'accepted')}
                    className="flex-1"
                  >
                    Chấp nhận
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleOfferAction(offer.id, 'declined')}
                    className="flex-1"
                  >
                    Từ chối
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BankOffers;
