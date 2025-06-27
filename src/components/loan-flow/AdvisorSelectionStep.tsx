
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Award, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdvisorProfile {
  id: string;
  full_name: string;
  bank_name: string;
  avatar_url?: string;
  years_experience: number;
  average_rating: number;
  total_reviews: number;
  specializations: string[];
  bio?: string;
  availability_status: string;
}

interface AdvisorSelectionStepProps {
  onSelectAdvisor: (advisorId: string) => void;
  onBack: () => void;
  selectedProductType: string;
}

const AdvisorSelectionStep = ({ onSelectAdvisor, onBack, selectedProductType }: AdvisorSelectionStepProps) => {
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('availability_status', 'available')
        .gte('average_rating', 4.0)
        .order('average_rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      setAdvisors(data || []);
    } catch (error) {
      console.error('Error fetching advisors:', error);
      toast.error('Lỗi khi tải danh sách tư vấn viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdvisor = (advisorId: string) => {
    setSelectedAdvisor(advisorId);
  };

  const handleConfirmSelection = () => {
    if (selectedAdvisor) {
      onSelectAdvisor(selectedAdvisor);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách tư vấn viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Chọn tư vấn viên</h2>
        <p className="text-gray-600 text-lg">
          Chọn tư vấn viên phù hợp để được hỗ trợ tốt nhất cho nhu cầu vay của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advisors.map((advisor) => (
          <Card
            key={advisor.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedAdvisor === advisor.id
                ? 'border-brand-500 ring-2 ring-brand-200 bg-brand-50'
                : 'border-gray-200 hover:border-brand-300'
            }`}
            onClick={() => handleSelectAdvisor(advisor.id)}
          >
            <CardHeader className="text-center pb-4">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={advisor.avatar_url} alt={advisor.full_name} />
                <AvatarFallback className="bg-brand-600 text-white text-lg">
                  {advisor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <CardTitle className="text-lg font-bold">{advisor.full_name}</CardTitle>
              <p className="text-brand-600 font-medium">{advisor.bank_name}</p>
              
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{advisor.average_rating.toFixed(1)}</span>
                <span className="text-gray-500">({advisor.total_reviews} đánh giá)</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4 text-brand-500" />
                <span>{advisor.years_experience} năm kinh nghiệm</span>
              </div>

              {advisor.specializations && advisor.specializations.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Chuyên môn:</p>
                  <div className="flex flex-wrap gap-1">
                    {advisor.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {advisor.bio && (
                <p className="text-sm text-gray-600 line-clamp-2">{advisor.bio}</p>
              )}

              <div className="pt-2">
                <Badge 
                  variant="outline" 
                  className={`${
                    advisor.availability_status === 'available' 
                      ? 'border-green-500 text-green-700 bg-green-50' 
                      : 'border-gray-500 text-gray-700'
                  }`}
                >
                  {advisor.availability_status === 'available' ? 'Sẵn sàng tư vấn' : 'Bận'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {advisors.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            Hiện tại chưa có tư vấn viên nào sẵn sàng. 
            Vui lòng thử lại sau hoặc liên hệ với chúng tôi.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        {selectedAdvisor && (
          <Button 
            onClick={handleConfirmSelection}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Bắt đầu tư vấn
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdvisorSelectionStep;
