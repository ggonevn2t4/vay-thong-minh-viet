import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MessageCircle,
  Calendar,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const AdvisorMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    minRating: 0,
    maxExperience: 50,
    location: '',
    bankName: '',
    specializations: [],
    availabilityOnly: false,
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      setIsLoading(true);
      
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
      // Tab filter
      if (activeTab !== 'all') {
        const hasSpecialization = advisor.specializations?.some(spec => 
          spec.toLowerCase().includes(activeTab)
        );
        if (!hasSpecialization) return false;
      }

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
  }, [advisors, filters, activeTab]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    locations: [...new Set(advisors.map(a => a.location).filter(Boolean))],
    bankNames: [...new Set(advisors.map(a => a.bank_name).filter(Boolean))],
    specializations: [...new Set(advisors.flatMap(a => a.specializations || []))]
  }), [advisors]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleContactAdvisor = (advisor: Advisor) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Navigate to messaging or contact form
    navigate('/messages', { state: { advisorId: advisor.user_id } });
  };

  const handleStartLoanApplication = (advisor: Advisor) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Navigate to loan application with pre-selected advisor
    navigate('/loan-application', { state: { preSelectedAdvisor: advisor } });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Marketplace Tư Vấn Viên
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Đang tải danh sách tư vấn viên chuyên nghiệp...
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Marketplace Tư Vấn Viên
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Kết nối với các tư vấn viên tài chính chuyên nghiệp từ các ngân hàng uy tín. 
              Tất cả đều được xác minh và có kinh nghiệm dày dặn.
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:flex">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="tín chấp">Vay tín chấp</TabsTrigger>
              <TabsTrigger value="thế chấp">Vay thế chấp</TabsTrigger>
              <TabsTrigger value="ô tô">Vay mua xe</TabsTrigger>
              <TabsTrigger value="kinh doanh">Kinh doanh</TabsTrigger>
              <TabsTrigger value="học tập">Học tập</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
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
                    <Button 
                      onClick={() => {
                        setFilters({
                          searchQuery: '',
                          minRating: 0,
                          maxExperience: 50,
                          location: '',
                          bankName: '',
                          specializations: [],
                          availabilityOnly: false,
                          sortBy: 'rating'
                        });
                        setActiveTab('all');
                      }}
                      variant="outline"
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedAdvisors.map((advisor) => (
                    <Card 
                      key={advisor.id}
                      className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
                            <h3 className="font-bold text-lg text-gray-900 truncate mb-2">
                              {advisor.full_name || 'Tư vấn viên'}
                            </h3>
                            
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

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactAdvisor(advisor)}
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Liên hệ
                          </Button>
                          
                          <Button 
                            size="sm"
                            onClick={() => handleStartLoanApplication(advisor)}
                            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Calendar className="w-4 h-4" />
                            Vay ngay
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Information Alert */}
              {filteredAndSortedAdvisors.length > 0 && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">
                    <strong>Thông tin:</strong> Tất cả tư vấn viên đều đã được xác minh chuyên môn và kinh nghiệm bởi các ngân hàng đối tác. 
                    Bạn có thể liên hệ trực tiếp hoặc bắt đầu quy trình vay ngay lập tức.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdvisorMarketplace;