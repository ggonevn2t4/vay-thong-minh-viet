
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react';

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
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md group">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl bg-gradient-to-br from-brand-500 to-brand-600 p-3 rounded-xl">
            {offer.bankLogo}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
              {offer.bankName}
            </CardTitle>
            {renderStars(offer.rating)}
          </div>
        </div>
        <Badge variant="secondary" className="w-fit bg-brand-100 text-brand-700 font-medium">
          {offer.loanType}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="text-center p-6 bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl border border-brand-200">
          <div className="text-4xl font-bold text-brand-600 mb-1">
            {offer.interestRate}%
          </div>
          <p className="text-sm text-brand-700 font-medium">Lãi suất từ</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-gray-700 mb-1">Mức vay:</p>
            <p className="text-gray-600 font-medium">
              {formatCurrency(offer.minAmount)} - {formatCurrency(offer.maxAmount)} đ
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-semibold text-gray-700 mb-1">Thời hạn:</p>
            <p className="text-gray-600 font-medium">{offer.term}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-brand-500" />
            <span className="font-medium">{offer.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-brand-500" />
            <span className="font-medium">Xử lý trong {offer.processingTime}</span>
          </div>
        </div>

        <div>
          <p className="font-semibold text-gray-700 text-sm mb-3">Yêu cầu chính:</p>
          <ul className="space-y-2">
            {offer.requirements.slice(0, 2).map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{req}</span>
              </li>
            ))}
            {offer.requirements.length > 2 && (
              <li className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-1 rounded">
                +{offer.requirements.length - 2} yêu cầu khác
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-4 space-y-3">
        <Button className="w-full bg-brand-600 hover:bg-brand-700 font-semibold py-3 group">
          Xem chi tiết
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button variant="outline" className="w-full border-brand-200 text-brand-600 hover:bg-brand-50 font-medium py-3">
          Liên hệ ngân hàng
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BankOfferCard;
