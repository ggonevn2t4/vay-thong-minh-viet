
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Phone, Mail, MessageSquare, Clock, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BankEmployee {
  id: string;
  full_name: string;
  bank_name: string;
  branch_name?: string;
  branch_address?: string;
  position?: string;
  department?: string;
  specializations?: string[];
  avatar_url?: string;
  phone?: string;
  email?: string;
  bio?: string;
  average_rating: number;
  total_reviews: number;
  total_clients_helped: number;
  success_rate: number;
  location?: string;
  service_area?: string[];
  availability_status?: string;
  working_hours?: any;
  certifications?: string[];
  languages?: string[];
}

interface BankEmployeeDirectoryProps {
  onSelectEmployee: (employee: BankEmployee) => void;
  userLocation?: string;
}

const BankEmployeeDirectory: React.FC<BankEmployeeDirectoryProps> = ({ 
  onSelectEmployee, 
  userLocation 
}) => {
  const [employees, setEmployees] = useState<BankEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  useEffect(() => {
    fetchBankEmployees();
  }, []);

  const fetchBankEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('availability_status', 'available')
        .order('average_rating', { ascending: false });

      if (error) throw error;

      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching bank employees:', error);
      toast.error('Không thể tải danh sách nhân viên ngân hàng');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockEmployees: BankEmployee[] = [
    {
      id: '1',
      full_name: 'Nguyễn Thị Hoa',
      bank_name: 'Vietcombank',
      branch_name: 'Chi nhánh Đống Đa',
      branch_address: '108 Trần Duy Hưng, Cầu Giấy, Hà Nội',
      position: 'Chuyên viên tư vấn vay',
      department: 'Phòng khách hàng cá nhân',
      specializations: ['Vay mua nhà', 'Vay tiêu dùng', 'Thẻ tín dụng'],
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b5b96d2a?w=100&h=100&fit=crop&crop=face',
      phone: '0987654321',
      email: 'hoa.nguyen@vietcombank.com.vn',
      bio: 'Có 8 năm kinh nghiệm trong lĩnh vực tư vấn tài chính, chuyên về các sản phẩm vay mua nhà và vay tiêu dùng.',
      average_rating: 4.8,
      total_reviews: 156,
      total_clients_helped: 890,
      success_rate: 95,
      location: 'Hà Nội',
      service_area: ['Hà Nội', 'Bắc Ninh', 'Hưng Yên'],
      availability_status: 'available',
      working_hours: { start: '08:00', end: '17:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      certifications: ['Chứng chỉ Tư vấn Tài chính', 'Chứng chỉ Quản lý Rủi ro'],
      languages: ['Tiếng Việt', 'Tiếng Anh']
    },
    {
      id: '2',
      full_name: 'Trần Văn Minh',
      bank_name: 'Techcombank',
      branch_name: 'Chi nhánh Quận 1',
      branch_address: '191 Bà Triệu, Quận 1, TP.HCM',
      position: 'Chuyên gia tư vấn doanh nghiệp',
      department: 'Phòng khách hàng doanh nghiệp',
      specializations: ['Vay kinh doanh', 'Tài trợ thương mại', 'Quản lý dòng tiền'],
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      phone: '0912345678',
      email: 'minh.tran@techcombank.com.vn',
      bio: 'Chuyên gia với 12 năm kinh nghiệm trong tư vấn tài chính doanh nghiệp, đã hỗ trợ hơn 500 doanh nghiệp tiếp cận nguồn vốn.',
      average_rating: 4.9,
      total_reviews: 203,
      total_clients_helped: 567,
      success_rate: 98,
      location: 'TP.HCM',
      service_area: ['TP.HCM', 'Bình Dương', 'Đồng Nai'],
      availability_status: 'available',
      working_hours: { start: '08:30', end: '17:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      certifications: ['CFA Level II', 'Chứng chỉ Quản lý Dự án'],
      languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Nhật']
    },
    {
      id: '3',
      full_name: 'Lê Thị Mai',
      bank_name: 'BIDV',
      branch_name: 'Chi nhánh Hai Bà Trưng',
      branch_address: '194 Bà Triệu, Hai Bà Trưng, Hà Nội',
      position: 'Trưởng phòng tư vấn khách hàng',
      department: 'Phòng bán lẻ',
      specializations: ['Vay mua xe', 'Bảo hiểm', 'Đầu tư tài chính'],
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      phone: '0934567890',
      email: 'mai.le@bidv.com.vn',
      bio: 'Trưởng phòng có 10 năm kinh nghiệm, chuyên tư vấn các sản phẩm tài chính cá nhân và gia đình.',
      average_rating: 4.7,
      total_reviews: 178,
      total_clients_helped: 1200,
      success_rate: 94,
      location: 'Hà Nội',
      service_area: ['Hà Nội', 'Hà Nam', 'Nam Định'],
      availability_status: 'available',
      working_hours: { start: '08:00', end: '17:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
      certifications: ['Chứng chỉ Quản lý Ngân hàng', 'Chứng chỉ Tư vấn Bảo hiểm'],
      languages: ['Tiếng Việt', 'Tiếng Anh']
    }
  ];

  // Use mock data if no real data available
  const displayEmployees = employees.length > 0 ? employees : mockEmployees;

  const filteredEmployees = displayEmployees.filter(employee => {
    const matchesSearch = employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || employee.location === locationFilter;
    const matchesBank = bankFilter === 'all' || employee.bank_name === bankFilter;
    const matchesSpecialization = specializationFilter === 'all' || 
                                 employee.specializations?.includes(specializationFilter);

    return matchesSearch && matchesLocation && matchesBank && matchesSpecialization;
  });

  const handleRequestSupport = (employee: BankEmployee) => {
    onSelectEmployee(employee);
    toast.success(`Đã gửi yêu cầu hỗ trợ đến ${employee.full_name}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Nhân viên ngân hàng tại khu vực của bạn
        </h2>
        <p className="text-gray-600">
          Kết nối trực tiếp với các chuyên gia tư vấn tại ngân hàng
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Tìm kiếm theo tên, ngân hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn khu vực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khu vực</SelectItem>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="TP.HCM">TP.HCM</SelectItem>
              <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>

          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn ngân hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ngân hàng</SelectItem>
              <SelectItem value="Vietcombank">Vietcombank</SelectItem>
              <SelectItem value="Techcombank">Techcombank</SelectItem>
              <SelectItem value="BIDV">BIDV</SelectItem>
            </SelectContent>
          </Select>

          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Chuyên môn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chuyên môn</SelectItem>
              <SelectItem value="Vay mua nhà">Vay mua nhà</SelectItem>
              <SelectItem value="Vay kinh doanh">Vay kinh doanh</SelectItem>
              <SelectItem value="Vay tiêu dùng">Vay tiêu dùng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee List */}
      <div className="space-y-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={employee.avatar_url} alt={employee.full_name} />
                    <AvatarFallback>{employee.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-800">{employee.full_name}</h3>
                      <Badge className="bg-blue-100 text-blue-700">{employee.bank_name}</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{employee.position}</p>
                    <p className="text-sm text-gray-500 mb-2">{employee.department}</p>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{employee.branch_name}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {employee.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                      {employee.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{employee.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats and Specializations */}
                <div className="flex-1 space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-yellow-600">{employee.average_rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{employee.total_reviews} đánh giá</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-green-600">{employee.success_rate}%</div>
                      <p className="text-xs text-gray-500">Thành công</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{employee.total_clients_helped}</div>
                      <p className="text-xs text-gray-500">Khách hàng</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-green-600">Có sẵn</span>
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Chuyên môn:</p>
                    <div className="flex flex-wrap gap-2">
                      {employee.specializations?.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  {employee.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{employee.bio}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleRequestSupport(employee)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Yêu cầu hỗ trợ
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy nhân viên ngân hàng phù hợp</p>
          <p className="text-gray-400 text-sm mt-2">Thử thay đổi bộ lọc tìm kiếm</p>
        </div>
      )}
    </div>
  );
};

export default BankEmployeeDirectory;
