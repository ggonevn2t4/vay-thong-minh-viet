import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Percent, Calendar, Shield, Home, Car, Building2, CreditCard, GraduationCap, Users } from 'lucide-react';
import { toast } from 'sonner';

interface LoanProduct {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  interestRate: string;
  term: string;
  features: string[];
  isHighlighted?: boolean;
  loanAmount: string;
  processingTime: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  benefits: string[];
  requirements: string[];
}

const loanProducts: LoanProduct[] = [
  {
    id: '1',
    title: 'Thẻ tín dụng',
    subtitle: 'Linh hoạt - Tiện lợi',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&crop=center',
    interestRate: '1.8% - 2.5%',
    term: 'Không kỳ hạn',
    loanAmount: '5 - 200 triệu',
    processingTime: '1-2 ngày',
    features: ['Thanh toán không tiền mặt', 'Ưu đãi cashback', 'Miễn lãi đến 55 ngày'],
    benefits: ['Tích điểm đổi quà', 'Bảo hiểm du lịch miễn phí', 'Giảm giá tại các đối tác'],
    requirements: ['Thu nhập từ 6 triệu/tháng', 'Làm việc ổn định từ 6 tháng', 'Không nợ xấu CIC'],
    icon: <CreditCard className="h-6 w-6" />,
    category: 'Tín chấp',
    description: 'Giải pháp thanh toán hiện đại với nhiều tiện ích và ưu đãi hấp dẫn'
  },
  {
    id: '2',
    title: 'Vay tiêu dùng tín chấp',
    subtitle: 'Nhanh chóng - Đơn giản',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center',
    interestRate: '8.5% - 15%',
    term: '6 - 84 tháng',
    loanAmount: '10 - 500 triệu',
    processingTime: '24 giờ',
    features: ['Không cần tài sản đảm bảo', 'Giải ngân nhanh trong ngày', 'Thủ tục đơn giản online'],
    benefits: ['Lãi suất ưu đãi cho khách hàng thân thiết', 'Miễn phí thẩm định', 'Tư vấn 24/7'],
    requirements: ['Thu nhập từ 8 triệu/tháng', 'Làm việc tại công ty từ 6 tháng', 'Không nợ xấu CIC'],
    icon: <CreditCard className="h-6 w-6" />,
    category: 'Tín chấp',
    description: 'Giải pháp vay vốn nhanh chóng dành cho người lao động có thu nhập ổn định'
  },
  {
    id: '3',
    title: 'Vay tiêu dùng thế chấp',
    subtitle: 'Lãi suất ưu đãi - Mức vay cao',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop&crop=center',
    interestRate: '6.5% - 12%',
    term: '12 - 120 tháng',
    loanAmount: '50 triệu - 5 tỷ',
    processingTime: '3-5 ngày',
    features: ['Lãi suất ưu đãi với tài sản đảm bảo', 'Mức vay cao đến 90% giá trị tài sản', 'Thời hạn vay dài'],
    benefits: ['Miễn phí thẩm định tài sản', 'Tư vấn pháp lý miễn phí', 'Ưu đãi khách hàng VIP'],
    requirements: ['Có tài sản đảm bảo hợp pháp', 'Thu nhập ổn định chứng minh được', 'Giấy tờ pháp lý đầy đủ'],
    icon: <Shield className="h-6 w-6" />,
    category: 'Thế chấp',
    description: 'Giải pháp vay tiêu dùng với lãi suất tốt nhất khi có tài sản đảm bảo'
  },
  {
    id: '4',
    title: 'Vay mua ô tô',
    subtitle: 'Ưu đãi - Linh hoạt',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop&crop=center',
    interestRate: '7.8% - 12%',
    term: '12 - 96 tháng',
    loanAmount: '100 triệu - 3 tỷ',
    processingTime: '2-3 ngày',
    features: ['Vay đến 100% giá trị xe', 'Thời hạn vay dài', 'Lãi suất cạnh tranh'],
    benefits: ['Miễn phí bảo hiểm năm đầu', 'Hỗ trợ làm thủ tục đăng ký xe', 'Ưu đãi phí trước bạ'],
    requirements: ['Thu nhập từ 15 triệu/tháng', 'Có giấy phép lái xe', 'Đóng BHXH đầy đủ'],
    icon: <Car className="h-6 w-6" />,
    category: 'Thế chấp',
    description: 'Sở hữu chiếc xe mơ ước với lãi suất ưu đãi và thủ tục đơn giản'
  },
  {
    id: '5',
    title: 'Vay mua bất động sản',
    subtitle: 'Bất động sản - Đầu tư',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop&crop=center',
    interestRate: '7.5% - 11%',
    term: '60 - 360 tháng',
    loanAmount: '200 triệu - 15 tỷ',
    processingTime: '5-7 ngày',
    features: ['Vay đến 70% giá trị căn hộ', 'Ân hạn nợ gốc đến khi nhận nhà', 'Lãi suất ưu đãi 6 tháng đầu'],
    benefits: ['Tư vấn chọn dự án uy tín', 'Hỗ trợ thủ tục pháp lý', 'Bảo hiểm khoản vay'],
    requirements: ['Có hợp đồng mua bán hợp lệ', 'Đã thanh toán tối thiểu 30%', 'Thu nhập ổn định chứng minh được'],
    icon: <Building2 className="h-6 w-6" />,
    category: 'Thế chấp',
    description: 'Sở hữu căn hộ mơ ước tại các dự án uy tín với điều kiện vay ưu đãi'
  },
  {
    id: '6',
    title: 'Vay xây sửa nhà ở',
    subtitle: 'Nhà ở - Đầu tư',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center',
    interestRate: '8.2% - 13%',
    term: '60 - 300 tháng',
    loanAmount: '100 triệu - 5 tỷ',
    processingTime: '5-7 ngày',
    features: ['Vay đến 80% chi phí xây dựng', 'Thời hạn vay lên đến 25 năm', 'Giải ngân theo tiến độ'],
    benefits: ['Tư vấn thiết kế miễn phí', 'Hỗ trợ giám sát thi công', 'Ưu đãi lãi suất giai đoạn đầu'],
    requirements: ['Có quyền sử dụng đất hợp pháp', 'Có thiết kế và dự toán chi tiết', 'Thu nhập ổn định'],
    icon: <Home className="h-6 w-6" />,
    category: 'Thế chấp',
    description: 'Hiện thực hóa ước mơ xây dựng tổ ấm với nguồn vốn ưu đãi'
  },
  {
    id: '7',
    title: 'Vay sản xuất kinh doanh',
    subtitle: 'Doanh nghiệp - Phát triển',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&crop=center',
    interestRate: '9.5% - 16%',
    term: '12 - 84 tháng',
    loanAmount: '50 triệu - 10 tỷ',
    processingTime: '3-5 ngày',
    features: ['Vay đến 70% nhu cầu vốn', 'Thời hạn vay linh hoạt', 'Ân hạn nợ gốc'],
    benefits: ['Tư vấn kế hoạch kinh doanh', 'Hỗ trợ mở rộng thị trường', 'Ưu đãi khách hàng lâu năm'],
    requirements: ['Doanh nghiệp hoạt động từ 1 năm', 'Có kế hoạch sử dụng vốn rõ ràng', 'Báo cáo tài chính minh bạch'],
    icon: <Building2 className="h-6 w-6" />,
    category: 'Thế chấp',
    description: 'Nguồn vốn tin cậy để phát triển và mở rộng hoạt động kinh doanh',
    isHighlighted: true
  }
];

const LoanProductGrid = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  
  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm' },
    { id: 'tín chấp', name: 'Tín chấp' },
    { id: 'thế chấp', name: 'Thế chấp' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? loanProducts 
    : loanProducts.filter(product => {
        const categoryMap: { [key: string]: string } = {
          'tín chấp': 'Tín chấp',
          'thế chấp': 'Thế chấp'
        };
        return product.category === categoryMap[selectedCategory];
      });

  const handleRegisterNow = (productTitle: string) => {
    console.log('Register now clicked for:', productTitle);
    
    // Map product title to product type for optimized questionnaire
    const productTypeMap: { [key: string]: string } = {
      'Thẻ tín dụng': 'credit_loan',
      'Vay tiêu dùng tín chấp': 'credit_loan', 
      'Vay tiêu dùng thế chấp': 'mortgage_loan',
      'Vay mua ô tô': 'car_loan',
      'Vay mua bất động sản': 'mortgage_loan',
      'Vay xây sửa nhà ở': 'mortgage_loan',
      'Vay sản xuất kinh doanh': 'business_loan'
    };
    
    const productType = productTypeMap[productTitle] || 'credit_loan';
    
    toast.success(`Chuyển đến khảo sát thông minh cho ${productTitle}`);
    navigate('/loan-application', { 
      state: { 
        selectedProduct: productType,
        productTitle: productTitle,
        fromMarketplace: true,
        optimizedQuestionnaire: true
      } 
    });
  };

  const handleViewDetails = (productId: string, productTitle: string) => {
    console.log('View details clicked for:', productTitle);
    toast.info(`Đang xem chi tiết ${productTitle}`);
    // For now, we'll show a toast. Later this could navigate to a detailed product page
    // navigate(`/product/${productId}`);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Danh sách sản phẩm vay</h2>
          <p className="text-gray-600 mb-6">Khám phá các sản phẩm vay đa dạng với lãi suất cạnh tranh</p>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${product.isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                {product.isHighlighted && (
                  <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                    Nổi bật
                  </Badge>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-blue-600">{product.icon}</div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-gray-500">Duyệt trong {product.processingTime}</span>
                </div>
                
                <CardTitle className="text-lg font-bold text-gray-800 mb-1">
                  {product.title}
                </CardTitle>
                <p className="text-sm text-blue-600 font-medium">{product.subtitle}</p>
                <p className="text-xs text-gray-600 mt-1">{product.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-blue-600">{product.interestRate}</div>
                    <div className="text-gray-600 text-xs">Lãi suất năm</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-green-600">{product.loanAmount}</div>
                    <div className="text-gray-600 text-xs">Mức vay</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-700">Thời hạn vay:</span>
                    <span className="text-xs font-bold text-blue-600">{product.term}</span>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-2">Ưu điểm nổi bật:</p>
                  <div className="space-y-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleRegisterNow(product.title)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
                  >
                    Đăng ký ngay
                  </Button>
                  <Button 
                    onClick={() => handleViewDetails(product.id, product.title)}
                    variant="outline" 
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-2"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào trong danh mục này</p>
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
            Xem thêm sản phẩm
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanProductGrid;
