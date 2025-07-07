import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  Search, 
  Filter, 
  ChevronDown, 
  Phone, 
  Mail,
  CheckCircle,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
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
  total_clients_helped: number;
  success_rate: number;
  specializations: string[];
  location: string;
  avatar_url?: string;
  bio?: string;
  availability_status: string;
  phone?: string;
  email?: string;
  certifications?: string[];
  languages?: string[];
  branch_name?: string;
  branch_address?: string;
}

interface FilterOptions {
  searchQuery: string;
  minRating: number;
  maxExperience: number;
  location: string;
  bankName: string;
  specializations: string[];
  availabilityOnly: boolean;
  sortBy: 'rating' | 'experience' | 'clients' | 'success_rate';
}

interface EnhancedAdvisorSelectionStepProps {
  selectedProductType: LoanProductType;
  onSelectAdvisor: (advisorId: string, advisorInfo: Advisor) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const EnhancedAdvisorSelectionStep: React.FC<EnhancedAdvisorSelectionStepProps> = ({
  selectedProductType,
  onSelectAdvisor,
  onBack,
  isSubmitting = false
}) => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    minRating: 0,
    maxExperience: 50,
    location: '',
    bankName: '',
    specializations: [],
    availabilityOnly: true,
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchAdvisors();
  }, [selectedProductType]);

  const fetchAdvisors = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all advisors with comprehensive data
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false });

      if (error) throw error;

      setAdvisors(data || []);
    } catch (error) {
      console.error('Error fetching advisors:', error);
      toast.error('Không thể tải danh sách tư vấn viên');
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced filtering and sorting logic
  const filteredAndSortedAdvisors = useMemo(() => {
    let filtered = advisors.filter(advisor => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${advisor.full_name} ${advisor.bank_name} ${advisor.job_title} ${advisor.bio || ''}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      // Rating filter
      if (advisor.average_rating < filters.minRating) return false;

      // Experience filter
      if (advisor.years_experience > filters.maxExperience) return false;

      // Location filter
      if (filters.location && !advisor.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;

      // Bank name filter
      if (filters.bankName && advisor.bank_name !== filters.bankName) return false;

      // Specialization filter
      if (filters.specializations.length > 0) {
        const hasMatchingSpec = filters.specializations.some(spec => 
          advisor.specializations?.some(advisorSpec => 
            advisorSpec.toLowerCase().includes(spec.toLowerCase())
          )
        );
        if (!hasMatchingSpec) return false;
      }

      // Availability filter
      if (filters.availabilityOnly && advisor.availability_status !== 'available') return false;

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        case 'experience':
          return (b.years_experience || 0) - (a.years_experience || 0);
        case 'clients':
          return (b.total_clients_helped || 0) - (a.total_clients_helped || 0);
        case 'success_rate':
          return (b.success_rate || 0) - (a.success_rate || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [advisors, filters]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    locations: [...new Set(advisors.map(a => a.location).filter(Boolean))],
    bankNames: [...new Set(advisors.map(a => a.bank_name).filter(Boolean))],
    specializations: [...new Set(advisors.flatMap(a => a.specializations || []))]
  }), [advisors]);

  const getSpecializationMatch = (advisor: Advisor) => {
    if (!advisor.specializations) return false;
    
    const productSpecializations = {
      'credit_loan': ['Vay tín chấp', 'Thẻ tín dụng', 'Vay tiêu dùng', 'Vay cá nhân'],
      'mortgage_loan': ['Vay thế chấp', 'Vay mua nhà', 'Bất động sản', 'Vay mua đất'],
      'car_loan': ['Vay mua xe', 'Vay ô tô', 'Xe máy'],
      'business_loan': ['Vay kinh doanh', 'Vay doanh nghiệp', 'SME'],
      'education_loan': ['Vay học tập', 'Du học', 'Giáo dục']
    };

    const relevantSpecs = productSpecializations[selectedProductType] || [];
    return advisor.specializations.some(spec => 
      relevantSpecs.some(relevantSpec => 
        spec.toLowerCase().includes(relevantSpec.toLowerCase())
      )
    );
  };

  const handleSelectAdvisor = (advisor: Advisor) => {
    if (isSubmitting) return;
    setSelectedAdvisorId(advisor.user_id);
    onSelectAdvisor(advisor.user_id, advisor);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đang tìm tư vấn viên phù hợp...
          </h2>
          <p className="text-gray-600 text-lg">
            Chúng tôi đang tìm kiếm những tư vấn viên tốt nhất cho bạn
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Chọn tư vấn viên chuyên nghiệp
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Lựa chọn tư vấn viên phù hợp với nhu cầu của bạn. Tất cả đều được xác minh và có kinh nghiệm chuyên môn.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm theo tên, ngân hàng, hoặc chuyên môn..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc nâng cao
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            
            <div className="text-sm text-gray-600">
              Hiển thị {filteredAndSortedAdvisors.length} / {advisors.length} tư vấn viên
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Đánh giá tối thiểu</label>
                  <Select value={filters.minRating.toString()} onValueChange={(value) => updateFilter('minRating', Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Tất cả</SelectItem>
                      <SelectItem value="3">3+ sao</SelectItem>
                      <SelectItem value="4">4+ sao</SelectItem>
                      <SelectItem value="4.5">4.5+ sao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Khu vực</label>
                  <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {filterOptions.locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Ngân hàng</label>
                  <Select value={filters.bankName} onValueChange={(value) => updateFilter('bankName', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngân hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {filterOptions.bankNames.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sắp xếp theo</label>
                  <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                      <SelectItem value="experience">Kinh nghiệm nhiều nhất</SelectItem>
                      <SelectItem value="clients">Khách hàng nhiều nhất</SelectItem>
                      <SelectItem value="success_rate">Tỷ lệ thành công cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Availability Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availability"
                  checked={filters.availabilityOnly}
                  onCheckedChange={(checked) => updateFilter('availabilityOnly', checked)}
                />
                <label htmlFor="availability" className="text-sm font-medium">
                  Chỉ hiển thị tư vấn viên đang sẵn sàng
                </label>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {filteredAndSortedAdvisors.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="text-gray-400 text-xl mb-4">Không tìm thấy tư vấn viên phù hợp</div>
            <p className="text-gray-600 mb-6">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setFilters({
                  searchQuery: '',
                  minRating: 0,
                  maxExperience: 50,
                  location: '',
                  bankName: '',
                  specializations: [],
                  availabilityOnly: true,
                  sortBy: 'rating'
                })}
                variant="outline"
              >
                Xóa bộ lọc
              </Button>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedAdvisors.map((advisor) => {
            const isSpecialized = getSpecializationMatch(advisor);
            const isSelected = selectedAdvisorId === advisor.user_id;
            
            return (
              <Card 
                key={advisor.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50 shadow-lg' : 'hover:shadow-lg'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleSelectAdvisor(advisor)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                        <AvatarImage src={advisor.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                          {advisor.full_name?.split(' ').map(n => n[0]).join('') || 'TV'}
                        </AvatarFallback>
                      </Avatar>
                      {advisor.availability_status === 'available' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900 truncate">
                          {advisor.full_name || 'Tư vấn viên'}
                        </h3>
                        {isSpecialized && (
                          <Badge className="bg-green-100 text-green-700 text-xs font-medium">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Chuyên môn
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-blue-600 font-semibold mb-1">
                        {advisor.bank_name}
                      </p>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {advisor.job_title || 'Tư vấn viên'} • {advisor.branch_name}
                      </p>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">
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
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="font-semibold text-gray-900">{advisor.total_clients_helped || 0}</div>
                      <div className="text-xs text-gray-600">Khách hàng</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="font-semibold text-gray-900">{advisor.success_rate || 0}%</div>
                      <div className="text-xs text-gray-600">Thành công</div>
                    </div>
                  </div>

                  {/* Location */}
                  {advisor.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{advisor.location}</span>
                    </div>
                  )}

                  {/* Bio */}
                  {advisor.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {advisor.bio}
                    </p>
                  )}

                  {/* Specializations */}
                  {advisor.specializations && advisor.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {advisor.specializations.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {advisor.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          +{advisor.specializations.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${
                      isSelected 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    } text-white font-semibold py-3`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && isSelected ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : isSelected ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Đã chọn
                      </div>
                    ) : (
                      'Chọn tư vấn viên'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Alert */}
      {filteredAndSortedAdvisors.length > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            <strong>Lưu ý:</strong> Tất cả tư vấn viên đều đã được xác minh chuyên môn và kinh nghiệm. 
            Sau khi chọn, bạn sẽ được chuyển đến bước hoàn thiện thông tin pháp lý.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedAdvisorSelectionStep;