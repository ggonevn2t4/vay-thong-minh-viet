
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { calculateLoan, formatCurrency, generateRepaymentSchedule, formatNumber, parseAmount } from '@/lib/utils';

interface LoanCalculatorProps {
  className?: string;
}

const LoanCalculator = ({ className }: LoanCalculatorProps) => {
  const [amount, setAmount] = useState<number>(100000000);
  const [amountInput, setAmountInput] = useState<string>("100.000.000");
  const [term, setTerm] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [rateInput, setRateInput] = useState<string>("10");
  const [paymentType, setPaymentType] = useState<string>("equal-payment");
  const [loanType, setLoanType] = useState<string>("personal");
  const [collateral, setCollateral] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loanResult, setLoanResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  }>({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0 });

  useEffect(() => {
    // Calculate loan details
    const result = calculateLoan(amount, interestRate, term / 12);
    setLoanResult(result);

    // Generate repayment schedule
    const repaymentSchedule = generateRepaymentSchedule(amount, interestRate, term / 12);
    setSchedule(repaymentSchedule.slice(0, 5)); // Show first 5 payments only
  }, [amount, term, interestRate, paymentType]);

  const handleAmountChange = (newAmount: number[]) => {
    setAmount(newAmount[0]);
    setAmountInput(formatNumber(newAmount[0]));
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountInput(value);
    
    // Parse the amount and update the slider
    const parsedAmount = parseAmount(value);
    if (!isNaN(parsedAmount)) {
      setAmount(parsedAmount);
    }
  };

  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRateInput(value);
    
    const parsedRate = parseFloat(value);
    if (!isNaN(parsedRate)) {
      setInterestRate(parsedRate);
    }
  };

  const handleTermChange = (newTerm: number[]) => {
    setTerm(newTerm[0]);
  };

  const renderLoanTypes = () => {
    const types = [
      { id: 'personal', name: 'Vay tiêu dùng', rate: '12-18%' },
      { id: 'mortgage', name: 'Vay mua nhà', rate: '8-12%' },
      { id: 'car', name: 'Vay mua xe', rate: '9-14%' },
      { id: 'business', name: 'Vay kinh doanh', rate: '10-15%' },
    ];

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {types.map((type) => (
          <div
            key={type.id}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              loanType === type.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
            }`}
            onClick={() => setLoanType(type.id)}
          >
            <div className="font-medium">{type.name}</div>
            <div className="text-sm text-muted-foreground">Lãi suất: {type.rate}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Máy tính khoản vay</CardTitle>
        <CardDescription>Tính toán chi tiết khoản vay của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="calculator">Máy tính vay</TabsTrigger>
            <TabsTrigger value="options">Tùy chọn nâng cao</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {renderLoanTypes()}

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
                      onValueChange={handleAmountChange}
                    />
                  </div>
                  <div className="w-32">
                    <Input 
                      value={amountInput}
                      onChange={handleAmountInputChange}
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
                  onValueChange={handleTermChange}
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
                      onValueChange={(value) => setInterestRate(value[0])}
                    />
                  </div>
                  <div className="w-16">
                    <Input 
                      value={rateInput}
                      onChange={handleRateInputChange}
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
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Loại trả góp</Label>
                <RadioGroup 
                  value={paymentType}
                  onValueChange={setPaymentType}
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
                    onChange={(e) => setCollateral(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="collateral" className="font-normal cursor-pointer">
                    Có tài sản đảm bảo (giảm lãi suất)
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Trả hàng tháng</div>
              <div className="text-lg font-bold">{formatCurrency(loanResult.monthlyPayment)} đ</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Tổng tiền lãi</div>
              <div className="text-lg font-bold">{formatCurrency(loanResult.totalInterest)} đ</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Tổng số tiền phải trả</div>
              <div className="text-lg font-bold">{formatCurrency(loanResult.totalPayment)} đ</div>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">Xem lịch trả nợ</Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" style={{ width: '600px', maxWidth: '90vw' }}>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Lịch trả nợ ước tính</h3>
                <p className="text-sm text-muted-foreground">5 kỳ trả nợ đầu tiên</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kỳ</TableHead>
                    <TableHead>Gốc phải trả</TableHead>
                    <TableHead>Lãi phải trả</TableHead>
                    <TableHead>Tổng phải trả</TableHead>
                    <TableHead>Dư nợ gốc</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell>{month.month}</TableCell>
                      <TableCell>{formatCurrency(month.principalPayment)} đ</TableCell>
                      <TableCell>{formatCurrency(month.interestPayment)} đ</TableCell>
                      <TableCell>{formatCurrency(month.totalPayment)} đ</TableCell>
                      <TableCell>{formatCurrency(month.remainingPrincipal)} đ</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-3 text-center border-t">
                <p className="text-sm text-muted-foreground">
                  Đây là ước tính ban đầu. Số tiền thực tế có thể thay đổi.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Đặt lại</Button>
        <Button>Đăng ký khoản vay</Button>
      </CardFooter>
    </Card>
  );
};

export default LoanCalculator;
