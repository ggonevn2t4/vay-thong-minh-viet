
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock, Star, CheckCircle } from 'lucide-react';

interface BankOffer {
  id: string;
  bankName: string;
  bankLogo: string;
  loanType: string;
  interestRate: number;
  maxAmount: number;
  minAmount: number;
  term: string;
  requirements: string[];
  processingTime: string;
  location: string;
  rating: number;
}

interface BankOfferCardProps {
  offer: BankOffer;
}

const BankOfferCard = ({ offer }: BankOfferCardProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{offer.bankLogo}</div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {offer.bankName}
            </CardTitle>
            {renderStars(offer.rating)}
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {offer.loanType}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-brand-50 rounded-lg">
          <div className="text-3xl font-bold text-brand-600">
            {offer.interestRate}%
          </div>
          <p className="text-sm text-gray-600">Lãi suất từ</p>
        </div>
        
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <p className="font-medium text-gray-700">Mức vay:</p>
            <p className="text-gray-600">
              {formatCurrency(offer.minAmount)} - {formatCurrency(offer.maxAmount)} đ
            </p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700">Thời hạn:</p>
            <p className="text-gray-600">{offer.term}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{offer.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Xử lý trong {offer.processingTime}</span>
        </div>

        <div>
          <p className="font-medium text-gray-700 text-sm mb-2">Yêu cầu:</p>
          <ul className="space-y-1">
            {offer.requirements.slice(0, 2).map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{req}</span>
              </li>
            ))}
            {offer.requirements.length > 2 && (
              <li className="text-xs text-gray-500">
                +{offer.requirements.length - 2} yêu cầu khác
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-4 space-y-2">
        <Button className="w-full bg-brand-600 hover:bg-brand-700">
          Xem chi tiết
        </Button>
        <Button variant="outline" className="w-full">
          Liên hệ ngân hàng
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BankOfferCard;
