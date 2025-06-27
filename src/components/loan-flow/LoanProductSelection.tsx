
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';
import { LoanProduct, LoanProductType } from '@/types/loan-application-flow';
import { loanProducts } from '@/data/loan-products';

interface LoanProductSelectionProps {
  selectedProduct: LoanProductType | null;
  onSelectProduct: (productType: LoanProductType) => void;
  onNext: () => void;
}

const LoanProductSelection = ({ selectedProduct, onSelectProduct, onNext }: LoanProductSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Chọn sản phẩm vay phù hợp</h2>
        <p className="text-gray-600 text-lg">Chúng tôi có nhiều sản phẩm vay để đáp ứng nhu cầu của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {loanProducts.map((product) => (
          <Card
            key={product.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedProduct === product.id
                ? 'border-brand-500 ring-2 ring-brand-200 bg-brand-50'
                : 'border-gray-200 hover:border-brand-300'
            }`}
            onClick={() => onSelectProduct(product.id)}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-2">{product.icon}</div>
              <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                {product.name}
                {selectedProduct === product.id && (
                  <Check className="h-5 w-5 text-brand-600" />
                )}
              </CardTitle>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Ưu điểm:</h4>
                <ul className="space-y-1">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Yêu cầu:</h4>
                <ul className="space-y-1">
                  {product.requirements.map((requirement, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {index + 1}
                      </Badge>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <div className="flex justify-center">
          <Button 
            onClick={onNext}
            className="bg-brand-600 hover:bg-brand-700 px-8 py-3 text-lg"
          >
            Tiếp tục
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoanProductSelection;
