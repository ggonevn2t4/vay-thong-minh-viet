
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentOptionsProps {
  paymentType: string;
  collateral: boolean;
  onPaymentTypeChange: (value: string) => void;
  onCollateralChange: (checked: boolean) => void;
}

const PaymentOptions = ({
  paymentType,
  collateral,
  onPaymentTypeChange,
  onCollateralChange,
}: PaymentOptionsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Loại trả góp</Label>
        <RadioGroup 
          value={paymentType}
          onValueChange={onPaymentTypeChange}
          className="grid grid-cols-1 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="equal-payment" id="equal-payment" />
            <Label htmlFor="equal-payment" className="font-normal cursor-pointer">
              Trả góp đều (tiền gốc + lãi)
            </Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="equal-principal" id="equal-principal" />
            <Label htmlFor="equal-principal" className="font-normal cursor-pointer">
              Trả gốc đều + lãi
            </Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="balloon" id="balloon" />
            <Label htmlFor="balloon" className="font-normal cursor-pointer">
              Trả lãi hàng tháng, gốc cuối kỳ
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-2">
        <div className="flex items-center space-x-2 border p-3 rounded-md">
          <input 
            type="checkbox" 
            id="collateral"
            checked={collateral}
            onChange={(e) => onCollateralChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="collateral" className="font-normal cursor-pointer">
            Có tài sản đảm bảo (giảm lãi suất)
          </Label>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
