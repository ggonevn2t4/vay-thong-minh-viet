
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, Users, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoanProductType } from '@/types/loan-application-flow';
import { toast } from 'sonner';

interface Advisor {
  id: string;
  user_id: string;
  full_name: string;
  bank_name: string;
  job_title: string;
  years_experience: number;
  average_rating: number;
  total_reviews: number;
  specializations: string[];
  location: string;
  avatar_url?: string;
  bio?: string;
  availability_status: string;
}

interface AdvisorSelectionStepProps {
  selectedProductType: LoanProductType;
  onSelectAdvisor: (advisorId: string) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const AdvisorSelectionStep: React.FC<AdvisorSelectionStepProps> = ({
  selectedProductType,
  onSelectAdvisor,
  onBack,
  isSubmitting = false
}) => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvisors();
  }, [selectedProductType]);

  const fetchAdvisors = async () => {
    try {
      setIsLoading(true);
      
      // Fetch advisors based on product type and specializations
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('availability_status', 'available')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false })
        .limit(6);

      if (error) throw error;

      setAdvisors(data || []);
    } catch (error) {
      console.error('Error fetching advisors:', error);
      toast.error('Không thể tải danh sách tư vấn viên');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAdvisor = (advisorId: string) => {
    if (isSubmitting) return;
    setSelectedAdvisorId(advisorId);
    onSelectAdvisor(advisorId);
  };

  const getSpecializationMatch = (advisor: Advisor) => {
    if (!advisor.specializations) return false;
    
    const productSpecializations = {
      'credit_loan': ['Vay tín chấp', 'Thẻ tín dụng', 'Vay tiêu dùng'],
      'mortgage_loan': ['Vay thế chấp', 'Vay mua nhà', 'Bất động sản']
    };

    const relevantSpecs = productSpecializations[selectedProductType] || [];
    return advisor.specializations.some(spec => 
      relevantSpecs.some(relevantSpec => 
        spec.toLowerCase().includes(relevantSpec.toLowerCase())
      )
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đang tìm tư vấn viên phù hợp...
          </h2>
          <p className="text-gray-600">
            Chúng tôi đang tìm kiếm những tư vấn viên tốt nhất cho bạn
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Chọn tư vấn viên
        </h2>
        <p className="text-gray-600">
          Lựa chọn tư vấn viên phù hợp để được hỗ trợ tốt nhất
        </p>
      </div>

      {advisors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-xl mb-4">Không tìm thấy tư vấn viên</div>
          <p className="text-gray-600 mb-4">
            Hiện tại không có tư vấn viên phù hợp. Vui lòng thử lại sau.
          </p>
          <Button onClick={onBack} variant="outline">
            Quay lại
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advisors.map((advisor) => {
            const isSpecialized = getSpecializationMatch(advisor);
            const isSelected = selectedAdvisorId === advisor.user_id;
            
            return (
              <Card 
                key={advisor.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleSelectAdvisor(advisor.user_id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={advisor.avatar_url} />
                      <AvatarFallback>
                        {advisor.full_name?.split(' ').map(n => n[0]).join('') || 'TV'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {advisor.full_name || 'Tư vấn viên'}
                        </h3>
                        {isSpecialized && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Chuyên môn
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-blue-600 font-medium">
                        {advisor.bank_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {advisor.job_title || 'Tư vấn viên'}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">
                        {advisor.average_rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-500">
                        ({advisor.total_reviews || 0})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{advisor.years_experience || 0} năm</span>
                    </div>
                  </div>

                  {advisor.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{advisor.location}</span>
                    </div>
                  )}

                  {advisor.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {advisor.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Clock className="w-4 h-4" />
                      <span>Sẵn sàng</span>
                    </div>
                    <Button 
                      size="sm" 
                      className={`${isSelected ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && isSelected ? 'Đang xử lý...' : isSelected ? 'Đã chọn' : 'Chọn'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdvisorSelectionStep;
