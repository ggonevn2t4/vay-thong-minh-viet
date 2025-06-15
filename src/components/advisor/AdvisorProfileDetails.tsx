
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, Phone, Mail, Star, Users, TrendingUp, Award, 
  Clock, Calendar, BookOpen, FileText, DollarSign,
  Building2, Shield, Globe, MessageCircle, Edit
} from 'lucide-react';
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
  bank_employee_id?: string;
  department?: string;
}

interface AdvisorProfileDetailsProps {
  advisorId: string;
  isOwnProfile?: boolean;
}

const AdvisorProfileDetails = ({ advisorId, isOwnProfile = false }: AdvisorProfileDetailsProps) => {
  const { toast } = useToast();
  const [advisor, setAdvisor] = useState<AdvisorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvisorProfile();
  }, [advisorId]);

  const fetchAdvisorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('id', advisorId)
        .single();

      if (error) throw error;

      if (data) {
        const profileData: AdvisorProfile = {
          ...data,
          certifications: data.certifications || [],
          languages: data.languages || [],
          specializations: data.specializations || [],
          achievements: data.achievements || [],
          loan_types: (data.loan_types as Record<string, number>) || {},
          working_hours: (data.working_hours as Record<string, any>) || {},
          total_clients_helped: data.total_clients_helped || 0,
          success_rate: Number(data.success_rate) || 0,
          average_rating: Number(data.average_rating) || 0,
          total_reviews: data.total_reviews || 0,
          is_verified: data.is_verified || false
        };
        setAdvisor(profileData);
      }
    } catch (error) {
      console.error('Error fetching advisor profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin tư vấn viên.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatWorkingHours = (hours: Record<string, any>) => {
    const daysMap = {
      monday: 'Thứ 2',
      tuesday: 'Thứ 3',
      wednesday: 'Thứ 4',
      thursday: 'Thứ 5',
      friday: 'Thứ 6',
      saturday: 'Thứ 7',
      sunday: 'Chủ nhật'
    };

    return Object.entries(hours).map(([day, schedule]) => ({
      day: daysMap[day as keyof typeof daysMap] || day,
      schedule: schedule
    }));
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy tư vấn viên</h2>
        <p className="text-gray-600">Thông tin tư vấn viên không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-50 to-blue-50">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={advisor.avatar_url} alt={advisor.full_name} />
                <AvatarFallback className="bg-brand-600 text-white text-2xl">
                  {advisor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {advisor.is_verified && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                advisor.availability_status === 'available' ? 'bg-green-500' :
                advisor.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{advisor.full_name}</h1>
                  <div className="space-y-1">
                    <p className="text-xl text-brand-600 font-semibold">{advisor.job_title}</p>
                    <div className="flex items-center gap-2 text-lg text-gray-700">
                      <Building2 className="h-5 w-5" />
                      <span>{advisor.bank_name}</span>
                      {advisor.department && <span>• {advisor.department}</span>}
                    </div>
                    {advisor.branch_address && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{advisor.branch_address}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge className={`${getAvailabilityColor(advisor.availability_status)} text-sm font-medium`}>
                      {getAvailabilityText(advisor.availability_status)}
                    </Badge>
                    {advisor.average_rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{advisor.average_rating.toFixed(1)}</span>
                        <span className="text-gray-500">({advisor.total_reviews} đánh giá)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {isOwnProfile && (
                    <Button variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Chỉnh sửa hồ sơ
                    </Button>
                  )}
                  <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Liên hệ tư vấn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="expertise">Chuyên môn</TabsTrigger>
              <TabsTrigger value="rates">Lãi suất</TabsTrigger>
              <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Bio */}
              {advisor.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Giới thiệu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{advisor.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-brand-500" />
                      <span className="text-2xl font-bold text-gray-900">{advisor.total_clients_helped}</span>
                    </div>
                    <p className="text-sm text-gray-600">Khách hàng đã hỗ trợ</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold text-gray-900">{advisor.success_rate}%</span>
                    </div>
                    <p className="text-sm text-gray-600">Tỷ lệ thành công</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900">{advisor.years_experience || 0}</span>
                    </div>
                    <p className="text-sm text-gray-600">Năm kinh nghiệm</p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {advisor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-brand-500" />
                      <span className="font-medium">{advisor.phone}</span>
                    </div>
                  )}
                  {advisor.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-brand-500" />
                      <span className="font-medium">{advisor.email}</span>
                    </div>
                  )}
                  {advisor.bank_employee_id && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-brand-500" />
                      <span className="font-medium">Mã nhân viên: {advisor.bank_employee_id}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expertise" className="space-y-6">
              {/* Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle>Lĩnh vực chuyên môn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {advisor.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="bg-brand-100 text-brand-700">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              {advisor.certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chứng chỉ & Bằng cấp</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {advisor.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {advisor.languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ngôn ngữ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {advisor.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="gap-1">
                          <Globe className="h-3 w-3" />
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Achievements */}
              {advisor.achievements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thành tích & Giải thưởng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {advisor.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Award className="h-5 w-5 text-green-500" />
                          <span className="font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Lãi suất hiện tại
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(advisor.loan_types).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(advisor.loan_types).map(([type, rate]) => (
                        <div key={type} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{type}</span>
                          <span className="text-xl font-bold text-brand-600">{rate}%</span>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Lưu ý:</strong> Lãi suất có thể thay đổi theo chính sách ngân hàng và điều kiện cụ thể của từng khách hàng.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Chưa có thông tin lãi suất</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Lịch làm việc
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(advisor.working_hours).length > 0 ? (
                    <div className="space-y-3">
                      {formatWorkingHours(advisor.working_hours).map(({ day, schedule }) => (
                        <div key={day} className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="font-medium">{day}</span>
                          <span className="text-gray-600">
                            {schedule?.start && schedule?.end 
                              ? `${schedule.start} - ${schedule.end}`
                              : 'Nghỉ'
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Chưa có thông tin lịch làm việc</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Đánh giá trung bình</span>
                  <span>{advisor.average_rating.toFixed(1)}/5</span>
                </div>
                <Progress value={(advisor.average_rating / 5) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tỷ lệ thành công</span>
                  <span>{advisor.success_rate}%</span>
                </div>
                <Progress value={advisor.success_rate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Button className="w-full bg-brand-600 hover:bg-brand-700" size="lg">
                Đặt lịch tư vấn
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Gửi tin nhắn
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Xem đánh giá
              </Button>
            </CardContent>
          </Card>

          {/* Verification Status */}
          {advisor.is_verified && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Đã xác minh</span>
                </div>
                <p className="text-sm text-green-700">
                  Tư vấn viên này đã được xác minh thông tin và chứng chỉ chuyên môn.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorProfileDetails;
