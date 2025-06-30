
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Percent, Calendar, Shield } from 'lucide-react';

interface LoanProduct {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  interestRate: string;
  term: string;
  features: string[];
  isHighlighted?: boolean;
}

const loanProducts: LoanProduct[] = [
  {
    id: '1',
    title: 'Vay tín chấp theo lương',
    subtitle: 'Linh hoạt',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center',
    interestRate: '84 tháng',
    term: 'Thời hạn vay tối đa',
    features: ['Thủ tục đơn giản', 'Giải ngân nhanh chóng']
  },
  {
    id: '2',
    title: 'Vay mua ô tô',
    subtitle: 'Ưu đãi',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop&crop=center',
    interestRate: '96 tháng',
    term: 'Thời hạn vay tối đa',
    features: ['100% giá trị xe', 'Lãi suất ưu đãi']
  },
  {
    id: '3',
    title: 'Ăn tâm kinh doanh',
    subtitle: 'Doanh nghiệp',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&crop=center',
    interestRate: '84 tháng',
    term: 'Thời hạn vay tối đa',
    features: ['70% phương án vay', 'Hỗ trợ doanh nghiệp']
  },
  {
    id: '4',
    title: 'Vay xây sửa nhà ở',
    subtitle: 'Nhà ở',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center',
    interestRate: '30 năm',
    term: 'Thời hạn vay tối đa',
    features: ['100% giá trị xây sửa', 'Lãi suất cạnh tranh']
  },
  {
    id: '5',
    title: 'Nhà Mơ Thành Đạt',
    subtitle: 'Ưu đãi đặc biệt',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=200&fit=crop&crop=center',
    interestRate: '40 năm',
    term: 'Thời hạn vay tối đa',
    features: ['70% giá trị căn nhà', 'Hỗ trợ trọn gói'],
    isHighlighted: true
  },
  {
    id: '6',
    title: 'Vay mua nhà dự án',
    subtitle: 'Bất động sản',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop&crop=center',
    interestRate: '30 năm',
    term: 'Thời hạn vay tối đa',
    features: ['100% giá trị ngôi nhà', 'Thủ tục nhanh gọn']
  }
];

const LoanProductGrid = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Danh sách sản phẩm</h2>
          <div className="flex justify-center gap-6 text-sm">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
              Tất cả sản phẩm
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-green-600">
              Vay tiêu dùng
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-green-600">
              Vay mua ô tô
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-green-600">
              Vay sản xuất kinh doanh
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-green-600">
              Vay mua căn hộ đồng sở hữu
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loanProducts.map((product) => (
            <Card key={product.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${product.isHighlighted ? 'ring-2 ring-green-500' : ''}`}>
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
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800">
                  {product.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{product.subtitle}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-600 text-lg">{product.interestRate}</div>
                    <div className="text-gray-600">{product.term}</div>
                  </div>
                  <div className="space-y-1">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2">
                    Đăng ký ngay
                  </Button>
                  <Button variant="outline" className="flex-1 border-green-600 text-green-600 hover:bg-green-50 text-sm py-2">
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
            Xem thêm
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanProductGrid;
