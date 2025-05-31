
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Target, FileText, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NegotiationStrategy {
  id: string;
  title: string;
  description: string;
  effectiveness: 'high' | 'medium' | 'low';
  template: string;
}

const InterestRateNegotiator = () => {
  const { toast } = useToast();
  const [currentRate, setCurrentRate] = useState(12.5);
  const [targetRate, setTargetRate] = useState(10.0);
  const [loanAmount, setLoanAmount] = useState(500000000);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');

  const strategies: NegotiationStrategy[] = [
    {
      id: 'competitor',
      title: 'So sánh với đối thủ cạnh tranh',
      description: 'Sử dụng mức lãi suất thấp hơn từ ngân hàng khác để thương lượng',
      effectiveness: 'high',
      template: 'Tôi đã nhận được đề xuất từ [Tên ngân hàng] với lãi suất [X]%/năm cho khoản vay tương tự. Ngân hàng có thể xem xét điều chỉnh lãi suất để cạnh tranh không?'
    },
    {
      id: 'loyalty',
      title: 'Nhấn mạnh mối quan hệ lâu dài',
      description: 'Tận dụng lịch sử làm việc tốt với ngân hàng',
      effectiveness: 'medium',
      template: 'Tôi đã là khách hàng trung thành của ngân hàng trong [X] năm với lịch sử thanh toán tốt. Tôi hy vọng ngân hàng có thể xem xét mức lãi suất ưu đãi cho khoản vay này.'
    },
    {
      id: 'package',
      title: 'Đề xuất gói dịch vụ tổng hợp',
      description: 'Cam kết sử ddụng nhiều dịch vụ để có lãi suất tốt hơn',
      effectiveness: 'high',
      template: 'Tôi sẵn sàng chuyển toàn bộ dịch vụ ngân hàng (lương, tiết kiệm, bảo hiểm) về ngân hàng nếu được hỗ trợ lãi suất ưu đãi cho khoản vay này.'
    },
    {
      id: 'timing',
      title: 'Tận dụng thời điểm thuận lợi',
      description: 'Đàm phán vào thời điểm ngân hàng có chương trình khuyến mãi',
      effectiveness: 'medium',
      template: 'Tôi thấy ngân hàng đang có chương trình ưu đãi lãi suất. Tôi có thể được áp dụng mức lãi suất này cho khoản vay của mình không?'
    },
    {
      id: 'collateral',
      title: 'Tăng cường tài sản đảm bảo',
      description: 'Đề xuất tài sản đảm bảo bổ sung để giảm lãi suất',
      effectiveness: 'high',
      template: 'Tôi có thể cung cấp thêm tài sản đảm bảo trị giá [X] VND để được xem xét giảm lãi suất. Điều này có giúp ngân hàng cân nhắc mức lãi suất thấp hơn không?'
    }
  ];

  const calculateSavings = () => {
    const rateDifference = currentRate - targetRate;
    const annualSavings = (loanAmount * rateDifference) / 100;
    const monthlySavings = annualSavings / 12;
    return { annualSavings, monthlySavings };
  };

  const generateNegotiationLetter = () => {
    const strategy = strategies.find(s => s.id === selectedStrategy);
    if (!strategy) return;

    const { annualSavings } = calculateSavings();
    
    const letter = `
Kính gửi Phòng tín dụng,

${strategy.template}

Với khoản vay ${loanAmount.toLocaleString('vi-VN')} VND, việc giảm lãi suất từ ${currentRate}% xuống ${targetRate}% sẽ giúp tôi tiết kiệm ${annualSavings.toLocaleString('vi-VN')} VND/năm, đồng thời tăng khả năng trả nợ đúng hạn.

${customMessage}

Tôi rất mong nhận được sự xem xét tích cực từ ngân hàng.

Trân trọng.
    `;

    setCustomMessage(letter);
    
    toast({
      title: "Đã tạo thư đàm phán",
      description: "Thư đàm phán lãi suất đã được tạo. Bạn có thể chỉnh sửa trước khi gửi.",
    });
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { annualSavings, monthlySavings } = calculateSavings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Công cụ đàm phán lãi suất
          </CardTitle>
          <CardDescription>
            Hỗ trợ đàm phán để có được mức lãi suất tốt nhất cho khoản vay của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="currentRate">Lãi suất hiện tại (%)</Label>
              <Input
                id="currentRate"
                type="number"
                step="0.1"
                value={currentRate}
                onChange={(e) => setCurrentRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="targetRate">Lãi suất mục tiêu (%)</Label>
              <Input
                id="targetRate"
                type="number"
                step="0.1"
                value={targetRate}
                onChange={(e) => setTargetRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="loanAmount">Số tiền vay (VND)</Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {monthlySavings.toLocaleString('vi-VN')} VND
              </div>
              <div className="text-sm text-gray-600">Tiết kiệm hàng tháng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {annualSavings.toLocaleString('vi-VN')} VND
              </div>
              <div className="text-sm text-gray-600">Tiết kiệm hàng năm</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-4">Chiến lược đàm phán</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategies.map((strategy) => (
                <div 
                  key={strategy.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStrategy === strategy.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStrategy(strategy.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{strategy.title}</h5>
                    <Badge className={getEffectivenessColor(strategy.effectiveness)}>
                      {strategy.effectiveness === 'high' ? 'Hiệu quả cao' : 
                       strategy.effectiveness === 'medium' ? 'Hiệu quả trung bình' : 'Hiệu quả thấp'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedStrategy && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Thư đàm phán</h4>
                <Button onClick={generateNegotiationLetter} variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Tạo thư mẫu
                </Button>
              </div>
              <Textarea
                placeholder="Nội dung thư đàm phán sẽ xuất hiện ở đây..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={10}
              />
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Lưu thư
                </Button>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Gửi đàm phán
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterestRateNegotiator;
