import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, Car, Building2, Home, Users } from 'lucide-react';
import { LoanProductType } from '@/types/loan-application-flow';

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'tín chấp' | 'thế chấp';
  interestRate: string;
  maxAmount: string;
  processingTime: string;
  features: string[];
  productType: LoanProductType;
}

interface LoanProductSelectionGridProps {
  onSelectProduct: (product: LoanProduct) => void;
  fromMarketplace?: boolean;
  selectedProduct?: string;
}

const loanProducts: LoanProduct[] = [
  {
    id: 'credit-card',
    name: 'Thẻ tín dụng',
    description: 'Linh hoạt thanh toán, ưu đãi cashback',
    icon: <CreditCard className="h-6 w-6" />,
    category: 'tín chấp',
    interestRate: '1.8% - 2.5%/tháng',
    maxAmount: '200 triệu',
    processingTime: '1-2 ngày',
    features: ['Miễn lãi đến 55 ngày', 'Tích điểm đổi quà', 'Bảo hiểm du lịch'],
    productType: 'credit_loan'
  },
  {
    id: 'consumer-unsecured',
    name: 'Vay tiêu dùng tín chấp',
    description: 'Không cần tài sản đảm bảo, giải ngân nhanh',
    icon: <CreditCard className="h-6 w-6" />,
    category: 'tín chấp',
    interestRate: '8.5% - 15%/năm',
    maxAmount: '500 triệu',
    processingTime: '24 giờ',
    features: ['Không cần tài sản đảm bảo', 'Thủ tục đơn giản', 'Giải ngân trong ngày'],
    productType: 'credit_loan'
  },
  {
    id: 'consumer-secured',
    name: 'Vay tiêu dùng thế chấp',
    description: 'Lãi suất ưu đãi với tài sản đảm bảo',
    icon: <Shield className="h-6 w-6" />,
    category: 'thế chấp',
    interestRate: '6.5% - 12%/năm',
    maxAmount: '5 tỷ',
    processingTime: '3-5 ngày',
    features: ['Lãi suất ưu đãi', 'Mức vay cao', 'Thời hạn dài'],
    productType: 'mortgage_loan'
  },
  {
    id: 'car-loan',
    name: 'Vay mua xe',
    description: 'Sở hữu xe mơ ước với lãi suất cạnh tranh',
    icon: <Car className="h-6 w-6" />,
    category: 'thế chấp',
    interestRate: '7.8% - 12%/năm',
    maxAmount: '3 tỷ',
    processingTime: '2-3 ngày',
    features: ['Vay đến 100% giá trị xe', 'Miễn phí bảo hiểm', 'Hỗ trợ đăng ký'],
    productType: 'mortgage_loan'
  },
  {
    id: 'real-estate',
    name: 'Vay mua bất động sản',
    description: 'Sở hữu căn hộ mơ ước',
    icon: <Building2 className="h-6 w-6" />,
    category: 'thế chấp',
    interestRate: '7.5% - 11%/năm',
    maxAmount: '15 tỷ',
    processingTime: '5-7 ngày',
    features: ['Vay đến 70% giá trị', 'Ân hạn nợ gốc', 'Lãi suất ưu đãi 6 tháng đầu'],
    productType: 'mortgage_loan'
  },
  {
    id: 'home-improvement',
    name: 'Vay xây sửa nhà ở',
    description: 'Hiện thực hóa ước mơ tổ ấm',
    icon: <Home className="h-6 w-6" />,
    category: 'thế chấp',
    interestRate: '8.2% - 13%/năm',
    maxAmount: '5 tỷ',
    processingTime: '5-7 ngày',
    features: ['Vay đến 80% chi phí', 'Giải ngân theo tiến độ', 'Tư vấn thiết kế'],
    productType: 'mortgage_loan'
  },
  {
    id: 'business',
    name: 'Vay sản xuất kinh doanh',
    description: 'Nguồn vốn phát triển doanh nghiệp',
    icon: <Users className="h-6 w-6" />,
    category: 'thế chấp',
    interestRate: '9.5% - 16%/năm',
    maxAmount: '10 tỷ',
    processingTime: '3-5 ngày',
    features: ['Vay đến 70% nhu cầu vốn', 'Ân hạn nợ gốc', 'Tư vấn kế hoạch kinh doanh'],
    productType: 'mortgage_loan'
  }
];

const LoanProductSelectionGrid: React.FC<LoanProductSelectionGridProps> = ({ 
  onSelectProduct, 
  fromMarketplace = false,
  selectedProduct 
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'tín chấp' | 'thế chấp'>('all');

  const categories = [
    { id: 'all' as const, name: 'Tất cả sản phẩm' },
    { id: 'tín chấp' as const, name: 'Tín chấp' },
    { id: 'thế chấp' as const, name: 'Thế chấp' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? loanProducts 
    : loanProducts.filter(product => product.category === selectedCategory);

  // Pre-select product if coming from marketplace
  React.useEffect(() => {
    if (fromMarketplace && selectedProduct) {
      const product = loanProducts.find(p => p.name === selectedProduct);
      if (product) {
        onSelectProduct(product);
      }
    }
  }, [fromMarketplace, selectedProduct, onSelectProduct]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Chọn sản phẩm vay phù hợp
        </h2>
        <p className="text-gray-600">
          Lựa chọn loại khoản vay phù hợp với nhu cầu của bạn
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            onClick={() => onSelectProduct(product)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-600">{product.icon}</div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  {product.category}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-gray-800">
                {product.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{product.description}</p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="font-bold text-blue-600">{product.interestRate}</div>
                  <div className="text-gray-600">Lãi suất</div>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className="font-bold text-green-600">{product.maxAmount}</div>
                  <div className="text-gray-600">Mức vay tối đa</div>
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-600 text-center">
                  Thời gian duyệt: <span className="font-semibold text-blue-600">{product.processingTime}</span>
                </div>
              </div>

              <div className="space-y-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoanProductSelectionGrid;
