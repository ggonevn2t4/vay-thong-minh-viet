
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Phone, Mail, Award, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdvisorProfile {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  specializations: string[];
  location: string;
  rating: number;
  reviewCount: number;
  clientsHelped: number;
  successRate: number;
  experience: string;
  phone?: string;
  email?: string;
  bio: string;
  certifications: string[];
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
}

interface AdvisorProfileCardProps {
  advisor: AdvisorProfile;
}

const AdvisorProfileCard = ({ advisor }: AdvisorProfileCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có thể liên hệ';
      case 'busy':
        return 'Đang bận';
      case 'offline':
        return 'Ngoại tuyến';
      default:
        return status;
    }
  };

  const handleContact = () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để liên hệ với tư vấn viên.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Chuyển hướng đến tin nhắn",
      description: `Bạn sẽ được chuyển đến trang tin nhắn để liên hệ với ${advisor.name}.`,
    });
  };

  const handleViewProfile = () => {
    toast({
      title: "Xem hồ sơ chi tiết",
      description: "Tính năng xem hồ sơ chi tiết đang được phát triển.",
    });
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={advisor.avatar} alt={advisor.name} />
                <AvatarFallback className="bg-brand-600 text-white text-lg">
                  {advisor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                advisor.availability === 'available' ? 'bg-green-500' :
                advisor.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
                {advisor.name}
              </CardTitle>
              <p className="text-sm text-brand-600 font-medium">{advisor.title}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{advisor.rating}</span>
                <span className="text-xs text-gray-500">({advisor.reviewCount} đánh giá)</span>
              </div>
            </div>
          </div>
          <Badge className={`${getAvailabilityColor(advisor.availability)} text-xs font-medium`}>
            {getAvailabilityText(advisor.availability)}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-brand-500" />
          <span>{advisor.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Specializations */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Chuyên môn:</p>
          <div className="flex flex-wrap gap-1">
            {advisor.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary" className="bg-brand-100 text-brand-700 text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-brand-500" />
              <span className="font-bold text-gray-700">{advisor.clientsHelped}</span>
            </div>
            <p className="text-xs text-gray-600">Khách hàng</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-bold text-gray-700">{advisor.successRate}%</span>
            </div>
            <p className="text-xs text-gray-600">Thành công</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="font-bold text-gray-700">{advisor.experience}</span>
            </div>
            <p className="text-xs text-gray-600">Kinh nghiệm</p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <p className="text-sm text-gray-600 line-clamp-3">{advisor.bio}</p>
        </div>

        {/* Certifications */}
        {advisor.certifications.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Chứng chỉ:</p>
            <div className="space-y-1">
              {advisor.certifications.slice(0, 2).map((cert, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <Award className="h-3 w-3 text-yellow-500" />
                  <span>{cert}</span>
                </div>
              ))}
              {advisor.certifications.length > 2 && (
                <p className="text-xs text-gray-500">+{advisor.certifications.length - 2} chứng chỉ khác</p>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {advisor.languages.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Ngôn ngữ:</p>
            <div className="flex flex-wrap gap-1">
              {advisor.languages.map((lang, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {advisor.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-brand-500" />
              <span>{advisor.phone}</span>
            </div>
          )}
          {advisor.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-brand-500" />
              <span>{advisor.email}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 space-y-2">
        <Button 
          onClick={handleContact}
          className="w-full bg-brand-600 hover:bg-brand-700 font-semibold"
          disabled={advisor.availability === 'offline'}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Liên hệ tư vấn
        </Button>
        <Button 
          variant="outline" 
          onClick={handleViewProfile}
          className="w-full border-brand-200 text-brand-600 hover:bg-brand-50"
        >
          Xem hồ sơ chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvisorProfileCard;
