import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Search, Filter, Clock, Star, Users, TrendingUp, Award, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type AdvisorProfileRow = Tables<'advisor_profiles'>;

interface AdvisorProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  job_title?: string;
  years_experience?: number;
  certifications: string[];
  languages: string[];
  bank_name: string;
  branch_name?: string;
  branch_address?: string;
  bio?: string;
  specializations: string[];
  achievements: string[];
  loan_types: Record<string, number>;
  availability_status: string;
  working_hours: Record<string, any>;
  total_clients_helped: number;
  success_rate: number;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
}

const EnhancedAdvisorDirectory = () => {
  const { toast } = useToast();
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bankFilter, setBankFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false });

      if (error) throw error;

      const transformedData: AdvisorProfile[] = (data || []).map((row: AdvisorProfileRow) => ({
        ...row,
        certifications: row.certifications || [],
        languages: row.languages || [],
        specializations: row.specializations || [],
        achievements: row.achievements || [],
        loan_types: (row.loan_types as Record<string, number>) || {},
        working_hours: (row.working_hours as Record<string, any>) || {},
        total_clients_helped: row.total_clients_helped || 0,
        success_rate: Number(row.success_rate) || 0,
        average_rating: Number(row.average_rating) || 0,
        total_reviews: row.total_reviews || 0,
        is_verified: row.is_verified || false
      }));

      setAdvisors(transformedData);
    } catch (error) {
      console.error('Error fetching advisors:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tư vấn viên.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = advisor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisor.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBank = bankFilter === 'all' || advisor.bank_name === bankFilter;
    const matchesSpecialization = specializationFilter === 'all' || 
                                 advisor.specializations.includes(specializationFilter);
    const matchesAvailability = availabilityFilter === 'all' || advisor.availability_status === availabilityFilter;

    return matchesSearch && matchesBank && matchesSpecialization && matchesAvailability;
  });

  const uniqueBanks = [...new Set(advisors.map(a => a.bank_name))];
  const uniqueSpecializations = [...new Set(advisors.flatMap(a => a.specializations))];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm tư vấn viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Ngân hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ngân hàng</SelectItem>
              {uniqueBanks.map(bank => (
                <SelectItem key={bank} value={bank}>{bank}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Chuyên môn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chuyên môn</SelectItem>
              {uniqueSpecializations.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="available">Có thể liên hệ</SelectItem>
              <SelectItem value="busy">Đang bận</SelectItem>
              <SelectItem value="offline">Ngoại tuyến</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="text-gray-600 mb-4">
        Tìm thấy {filteredAdvisors.length} tư vấn viên
      </div>

      {/* Advisor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdvisors.map((advisor) => (
          <Card key={advisor.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={advisor.avatar_url} alt={advisor.full_name} />
                      <AvatarFallback className="bg-brand-600 text-white text-lg">
                        {advisor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      advisor.availability_status === 'available' ? 'bg-green-500' :
                      advisor.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand-600 transition-colors">
                      {advisor.full_name}
                    </h3>
                    <p className="text-sm text-brand-600 font-medium">{advisor.job_title}</p>
                    <p className="text-sm text-gray-600">{advisor.bank_name}</p>
                    {advisor.average_rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{advisor.average_rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({advisor.total_reviews} đánh giá)</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={`${getAvailabilityColor(advisor.availability_status)} text-xs font-medium`}>
                  {getAvailabilityText(advisor.availability_status)}
                </Badge>
              </div>

              {advisor.branch_address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-brand-500" />
                  <span>{advisor.branch_address}</span>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Specializations */}
              {advisor.specializations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Chuyên môn:</p>
                  <div className="flex flex-wrap gap-1">
                    {advisor.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="bg-brand-100 text-brand-700 text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {advisor.specializations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{advisor.specializations.length - 3} khác
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-brand-500" />
                    <span className="font-bold text-gray-700">{advisor.total_clients_helped}</span>
                  </div>
                  <p className="text-xs text-gray-600">Khách hàng</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-bold text-gray-700">{advisor.success_rate}%</span>
                  </div>
                  <p className="text-xs text-gray-600">Thành công</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-gray-700">{advisor.years_experience || 0}</span>
                  </div>
                  <p className="text-xs text-gray-600">Năm KN</p>
                </div>
              </div>

              {/* Bio */}
              {advisor.bio && (
                <div>
                  <p className="text-sm text-gray-600 line-clamp-3">{advisor.bio}</p>
                </div>
              )}

              {/* Loan Types */}
              {Object.keys(advisor.loan_types).length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Lãi suất hiện tại:</p>
                  <div className="space-y-1">
                    {Object.entries(advisor.loan_types).slice(0, 2).map(([type, rate]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-gray-600">{type}</span>
                        <span className="font-medium text-brand-600">{rate}%</span>
                      </div>
                    ))}
                    {Object.keys(advisor.loan_types).length > 2 && (
                      <p className="text-xs text-gray-500">+{Object.keys(advisor.loan_types).length - 2} loại vay khác</p>
                    )}
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

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full bg-brand-600 hover:bg-brand-700 font-semibold"
                  disabled={advisor.availability_status === 'offline'}
                >
                  Liên hệ tư vấn
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-brand-200 text-brand-600 hover:bg-brand-50"
                >
                  Xem hồ sơ chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAdvisors.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Không tìm thấy tư vấn viên nào</div>
          <div className="text-gray-400">Hãy thử thay đổi bộ lọc tìm kiếm</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdvisorDirectory;
