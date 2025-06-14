
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Award, Filter } from 'lucide-react';
import AdvisorProfileCard from './AdvisorProfileCard';

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

const AdvisorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Mock data - replace with real data from API
  const advisors: AdvisorProfile[] = [
    {
      id: 'adv-001',
      name: 'Trần Minh Tú',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'Chuyên gia tư vấn vay mua nhà',
      specializations: ['Vay mua nhà', 'Vay xây dựng', 'Refinancing'],
      location: 'Hà Nội',
      rating: 4.8,
      reviewCount: 127,
      clientsHelped: 234,
      successRate: 95,
      experience: '8 năm',
      phone: '0901234567',
      email: 'tu.tran@example.com',
      bio: 'Chuyên gia với hơn 8 năm kinh nghiệm trong lĩnh vực tư vấn vay mua nhà. Đã hỗ trợ hơn 200 khách hàng thực hiện ước mơ sở hữu nhà riêng.',
      certifications: ['Chứng chỉ Tư vấn Tài chính', 'Chứng chỉ Môi giới Bất động sản'],
      languages: ['Tiếng Việt', 'Tiếng Anh'],
      availability: 'available'
    },
    {
      id: 'adv-002',
      name: 'Nguyễn Thị Hương',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5b96d2a?w=100&h=100&fit=crop&crop=face',
      title: 'Chuyên gia vay kinh doanh',
      specializations: ['Vay kinh doanh', 'Vay SME', 'Tư vấn doanh nghiệp'],
      location: 'TP.HCM',
      rating: 4.9,
      reviewCount: 89,
      clientsHelped: 156,
      successRate: 92,
      experience: '6 năm',
      phone: '0987654321',
      email: 'huong.nguyen@example.com',
      bio: 'Chuyên gia tư vấn tài chính doanh nghiệp với kinh nghiệm 6 năm. Đặc biệt am hiểu về nhu cầu tài chính của các doanh nghiệp vừa và nhỏ.',
      certifications: ['CFA Level II', 'Chứng chỉ Tư vấn Doanh nghiệp'],
      languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Trung'],
      availability: 'available'
    },
    {
      id: 'adv-003',
      name: 'Lê Văn Đức',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      title: 'Tư vấn viên vay tiêu dùng',
      specializations: ['Vay tiêu dùng', 'Vay tín chấp', 'Vay mua xe'],
      location: 'Đà Nẵng',
      rating: 4.7,
      reviewCount: 64,
      clientsHelped: 98,
      successRate: 88,
      experience: '4 năm',
      phone: '0912345678',
      email: 'duc.le@example.com',
      bio: 'Tư vấn viên trẻ năng động với 4 năm kinh nghiệm trong lĩnh vực vay tiêu dùng. Luôn sẵn sàng hỗ trợ khách hàng 24/7.',
      certifications: ['Chứng chỉ Tư vấn Tài chính Cá nhân'],
      languages: ['Tiếng Việt', 'Tiếng Anh'],
      availability: 'busy'
    },
    {
      id: 'adv-004',
      name: 'Phạm Thị Mai',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      title: 'Chuyên gia tài chính cá nhân',
      specializations: ['Vay cá nhân', 'Refinancing', 'Tư vấn đầu tư'],
      location: 'Hà Nội',
      rating: 4.6,
      reviewCount: 45,
      clientsHelped: 73,
      successRate: 90,
      experience: '5 năm',
      phone: '0923456789',
      email: 'mai.pham@example.com',
      bio: 'Chuyên gia tài chính cá nhân với phương pháp tư vấn cá nhân hóa, giúp khách hàng tìm ra giải pháp tài chính phù hợp nhất.',
      certifications: ['CFP', 'Chứng chỉ Quản lý Rủi ro'],
      languages: ['Tiếng Việt'],
      availability: 'available'
    }
  ];

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || advisor.location === locationFilter;
    const matchesSpecialization = specializationFilter === 'all' || 
                                 advisor.specializations.some(spec => spec.includes(specializationFilter));
    const matchesAvailability = availabilityFilter === 'all' || advisor.availability === availabilityFilter;
    
    return matchesSearch && matchesLocation && matchesSpecialization && matchesAvailability;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience);
      case 'clients':
        return b.clientsHelped - a.clientsHelped;
      case 'success_rate':
        return b.successRate - a.successRate;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Danh sách tư vấn viên</h1>
        <p className="text-gray-600">
          Tìm và kết nối với các chuyên gia tài chính hàng đầu
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, chuyên môn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-gray-200 focus:border-brand-500"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-12 border-gray-200">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khu vực</SelectItem>
                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                <SelectItem value="TP.HCM">TP.HCM</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger className="h-12 border-gray-200">
                <Award className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Chuyên môn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuyên môn</SelectItem>
                <SelectItem value="Vay mua nhà">Vay mua nhà</SelectItem>
                <SelectItem value="Vay kinh doanh">Vay kinh doanh</SelectItem>
                <SelectItem value="Vay tiêu dùng">Vay tiêu dùng</SelectItem>
                <SelectItem value="Vay cá nhân">Vay cá nhân</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 border-gray-200">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="experience">Kinh nghiệm nhiều nhất</SelectItem>
                <SelectItem value="clients">Khách hàng nhiều nhất</SelectItem>
                <SelectItem value="success_rate">Tỷ lệ thành công cao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-48 h-10 border-gray-200">
                <SelectValue placeholder="Tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="available">Có thể liên hệ</SelectItem>
                <SelectItem value="busy">Đang bận</SelectItem>
                <SelectItem value="offline">Ngoại tuyến</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-600">
              Tìm thấy {filteredAdvisors.length} tư vấn viên
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advisor Grid */}
      {filteredAdvisors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAdvisors.map((advisor) => (
            <AdvisorProfileCard key={advisor.id} advisor={advisor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Không tìm thấy tư vấn viên
          </h3>
          <p className="text-gray-500">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvisorDirectory;
