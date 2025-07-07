import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MessageSquare,
  Archive,
  AlertTriangle,
  FileText,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

type OfferStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'under_review';

interface BankOffer {
  id: string;
  loan_application_id: string;
  bank_name: string;
  offered_amount: number;
  interest_rate: number;
  term_months: number;
  status: OfferStatus;
  conditions?: string;
  processing_time_days?: number;
  offer_expires_at?: string;
  created_at: string;
  updated_at: string;
  offer_advantages?: string[];
  required_documents?: string[];
  advisor_id?: string;
}

interface OfferStatusManagerProps {
  offers: BankOffer[];
  onStatusUpdate: (offerId: string, status: OfferStatus, notes?: string) => Promise<void>;
}

const OfferStatusManager: React.FC<OfferStatusManagerProps> = ({ offers, onStatusUpdate }) => {
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusIcon = (status: OfferStatus) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'expired': return <Archive className="w-4 h-4 text-gray-500" />;
      case 'under_review': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: OfferStatus) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status: OfferStatus) => {
    switch (status) {
      case 'accepted': return 'Đã chấp nhận';
      case 'declined': return 'Đã từ chối';
      case 'expired': return 'Đã hết hạn';
      case 'under_review': return 'Đang xem xét';
      default: return 'Đang chờ';
    }
  };

  const isOfferExpired = (offer: BankOffer): boolean => {
    if (!offer.offer_expires_at) return false;
    return new Date(offer.offer_expires_at) < new Date();
  };

  const getDaysUntilExpiry = (offer: BankOffer): number | null => {
    if (!offer.offer_expires_at) return null;
    const expiryDate = new Date(offer.offer_expires_at);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStatusChange = async (offer: BankOffer, newStatus: OfferStatus) => {
    setSelectedOffer(offer);
    setActionNotes('');
  };

  const submitStatusChange = async (newStatus: OfferStatus) => {
    if (!selectedOffer) return;

    setIsSubmitting(true);
    try {
      await onStatusUpdate(selectedOffer.id, newStatus, actionNotes);
      setSelectedOffer(null);
      setActionNotes('');
      toast.success(`Đã cập nhật trạng thái đề nghị thành "${getStatusText(newStatus)}"`);
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast.error('Không thể cập nhật trạng thái đề nghị');
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedOffers = offers.reduce((acc, offer) => {
    const status = isOfferExpired(offer) ? 'expired' : offer.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(offer);
    return acc;
  }, {} as Record<string, BankOffer[]>);

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['pending', 'under_review', 'accepted', 'declined', 'expired'] as OfferStatus[]).map((status) => (
          <Card key={status}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(status)}
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {groupedOffers[status]?.length || 0}
              </p>
              <p className="text-sm text-gray-600">{getStatusText(status)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Offers by Status */}
      {Object.entries(groupedOffers).map(([status, statusOffers]) => (
        <Card key={status}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(status as OfferStatus)}
              {getStatusText(status as OfferStatus)} ({statusOffers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusOffers.map((offer) => {
                const isExpired = isOfferExpired(offer);
                const daysUntilExpiry = getDaysUntilExpiry(offer);
                
                return (
                  <div key={offer.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {offer.bank_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{offer.bank_name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(status as OfferStatus)}>
                              {getStatusText(status as OfferStatus)}
                            </Badge>
                            {daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 7 && (
                              <Badge variant="outline" className="text-orange-600 border-orange-300">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {daysUntilExpiry} ngày
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {offer.interest_rate}%
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(offer.offered_amount)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Thời hạn: </span>
                        <span className="font-medium">{offer.term_months} tháng</span>
                      </div>
                      
                      {offer.processing_time_days && (
                        <div className="text-sm">
                          <span className="text-gray-600">Xử lý: </span>
                          <span className="font-medium">{offer.processing_time_days} ngày</span>
                        </div>
                      )}
                      
                      {offer.offer_expires_at && (
                        <div className="text-sm">
                          <span className="text-gray-600">Hết hạn: </span>
                          <span className="font-medium">
                            {new Date(offer.offer_expires_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                    </div>

                    {offer.conditions && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Điều kiện:</p>
                        <p className="text-sm">{offer.conditions}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {offer.status === 'pending' && !isExpired && (
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(offer, 'accepted')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Chấp nhận
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Chấp nhận đề nghị từ {offer.bank_name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  Bạn có chắc chắn muốn chấp nhận đề nghị này? 
                                  Hành động này có thể không thể hoàn tác.
                                </AlertDescription>
                              </Alert>
                              
                              <div>
                                <label className="text-sm font-medium">Ghi chú (tùy chọn):</label>
                                <Textarea
                                  value={actionNotes}
                                  onChange={(e) => setActionNotes(e.target.value)}
                                  placeholder="Thêm ghi chú về quyết định của bạn..."
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => submitStatusChange('accepted')}
                                  disabled={isSubmitting}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận chấp nhận'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedOffer(null)}
                                  className="flex-1"
                                >
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => handleStatusChange(offer, 'declined')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Từ chối đề nghị từ {offer.bank_name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Lý do từ chối:</label>
                                <Textarea
                                  value={actionNotes}
                                  onChange={(e) => setActionNotes(e.target.value)}
                                  placeholder="Vui lòng cho biết lý do từ chối đề nghị này..."
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => submitStatusChange('declined')}
                                  disabled={isSubmitting}
                                  className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedOffer(null)}
                                  className="flex-1"
                                >
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Xem xét
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OfferStatusManager;