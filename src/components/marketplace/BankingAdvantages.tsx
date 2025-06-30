
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, Clock } from 'lucide-react';

const BankingAdvantages = () => {
  const advantages = [
    {
      icon: <Zap className="h-12 w-12 text-green-600" />,
      title: 'Giải ngân nhanh chóng',
      description: 'Thủ tục đơn giản, phê duyệt và giải ngân nhanh chóng, đáp ứng mọi nhu cầu cấp bách'
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: 'Lãi suất cạnh tranh',
      description: 'Lãi suất ưu đãi và cạnh tranh, mức vay cao với nhiều ưu đãi cho khách hàng thân thiết'
    },
    {
      icon: <Clock className="h-12 w-12 text-green-600" />,
      title: 'Phương thức trả nợ thuận tiện',
      description: 'Phương thức thanh toán khoa học giúp khách trả nợ, đóng góp, online hoặc tại quầy'
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Lợi ích khi lựa chọn sản phẩm vay của Vietcombank
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankingAdvantages;
