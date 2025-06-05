
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

interface LoanInputsProps {
  amount: number;
  amountInput: string;
  term: number;
  interestRate: number;
  rateInput: string;
  onAmountChange: (value: number[]) => void;
  onAmountInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTermChange: (value: number[]) => void;
  onRateInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (value: number[]) => void;
}

const LoanInputs = ({
  amount,
  amountInput,
  term,
  interestRate,
  rateInput,
  onAmountChange,
  onAmountInputChange,
  onTermChange,
  onRateInputChange,
  onRateChange,
}: LoanInputsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="amount">Số tiền vay</Label>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(amount)} đ
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Slider 
              id="amount"
              min={1000000} 
              max={1000000000} 
              step={1000000} 
              value={[amount]} 
              onValueChange={onAmountChange}
            />
          </div>
          <div className="w-32">
            <Input 
              value={amountInput}
              onChange={onAmountInputChange}
              className="text-right"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 triệu</span>
          <span>1 tỷ</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="term">Thời hạn vay</Label>
          <div className="text-sm text-muted-foreground">
            {term} tháng ({Math.floor(term / 12)} năm {term % 12} tháng)
          </div>
        </div>
        <Slider 
          id="term"
          min={1} 
          max={360} 
          step={1} 
          value={[term]} 
          onValueChange={onTermChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 tháng</span>
          <span>30 năm</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="interestRate">Lãi suất (%/năm)</Label>
          <div className="text-sm text-muted-foreground">
            {interestRate}%
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Slider 
              id="interestRate"
              min={0.1} 
              max={24} 
              step={0.1} 
              value={[interestRate]} 
              onValueChange={onRateChange}
            />
          </div>
          <div className="w-16">
            <Input 
              value={rateInput}
              onChange={onRateInputChange}
              className="text-right"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.1%</span>
          <span>24%</span>
        </div>
      </div>
    </div>
  );
};

export default LoanInputs;
