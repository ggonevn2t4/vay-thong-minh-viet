
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, calculateLoan, generateRepaymentSchedule, formatNumber, parseAmount } from '@/lib/utils';

const LoanSimulator = () => {
  const { toast } = useToast();
  // Primary loan parameters
  const [amount, setAmount] = useState<number>(300000000);
  const [amountInput, setAmountInput] = useState<string>("300.000.000");
  const [term, setTerm] = useState<number>(240); // 20 years
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [rateInput, setRateInput] = useState<string>("8.5");
  
  // Comparison loan parameters
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareAmount, setCompareAmount] = useState<number>(300000000);
  const [compareAmountInput, setCompareAmountInput] = useState<string>("300.000.000");
  const [compareTerm, setCompareTerm] = useState<number>(240);
  const [compareInterestRate, setCompareInterestRate] = useState<number>(9.5);
  const [compareRateInput, setCompareRateInput] = useState<string>("9.5");
  
  // Advanced settings
  const [paymentType, setPaymentType] = useState<string>("equal-payment");
  const [prepaymentAmount, setPrepaymentAmount] = useState<number>(0);
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<string>("none");
  
  // Results
  const [loanResult, setLoanResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  }>({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0 });
  
  const [compareLoanResult, setCompareLoanResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  }>({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0 });
  
  const [schedule, setSchedule] = useState<any[]>([]);
  const [compareSchedule, setCompareSchedule] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Calculate main loan
  useEffect(() => {
    const result = calculateLoan(amount, interestRate, term / 12);
    setLoanResult(result);
    
    // Generate repayment schedule
    const repaymentSchedule = generateRepaymentSchedule(amount, interestRate, term / 12);
    setSchedule(repaymentSchedule);
    
    // Update chart data
    updateChartData(repaymentSchedule, compareSchedule);
    
  }, [amount, term, interestRate, paymentType]);
  
  // Calculate comparison loan
  useEffect(() => {
    if (!compareMode) return;
    
    const result = calculateLoan(compareAmount, compareInterestRate, compareTerm / 12);
    setCompareLoanResult(result);
    
    // Generate repayment schedule
    const repaymentSchedule = generateRepaymentSchedule(compareAmount, compareInterestRate, compareTerm / 12);
    setCompareSchedule(repaymentSchedule);
    
    // Update chart data
    updateChartData(schedule, repaymentSchedule);
    
  }, [compareMode, compareAmount, compareTerm, compareInterestRate]);
  
  // Create chart data for comparison
  const updateChartData = (mainSchedule: any[], secondSchedule: any[]) => {
    if (!mainSchedule.length) return;
    
    // Get sample points - monthly for first year, then yearly
    const samplePoints: any[] = [];
    
    // Monthly for first year
    for (let i = 0; i < Math.min(12, mainSchedule.length); i++) {
      samplePoints.push({
        month: i + 1,
        principalA: mainSchedule[i].principalPayment,
        interestA: mainSchedule[i].interestPayment,
        remainingA: mainSchedule[i].remainingPrincipal,
        principalB: secondSchedule[i]?.principalPayment || 0,
        interestB: secondSchedule[i]?.interestPayment || 0,
        remainingB: secondSchedule[i]?.remainingPrincipal || 0,
      });
    }
    
    // Then yearly
    for (let year = 2; year <= Math.ceil(term / 12); year++) {
      const month = year * 12 - 1;
      if (month < mainSchedule.length) {
        samplePoints.push({
          month: month + 1,
          principalA: mainSchedule[month].principalPayment,
          interestA: mainSchedule[month].interestPayment,
          remainingA: mainSchedule[month].remainingPrincipal,
          principalB: secondSchedule[month]?.principalPayment || 0,
          interestB: secondSchedule[month]?.interestPayment || 0,
          remainingB: secondSchedule[month]?.remainingPrincipal || 0,
        });
      }
    }
    
    setChartData(samplePoints);
  };

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
  
  const handleSaveLoan = () => {
    toast({
      title: "Khoản vay đã được lưu",
      description: `Khoản vay ${formatCurrency(amount)}đ với lãi suất ${interestRate}% đã được lưu vào hồ sơ của bạn.`,
    });
  };
  
  const handleCompareModeChange = () => {
    setCompareMode(!compareMode);
  };
  
  const toggleCompareMode = () => {
    if (!compareMode) {
      // When enabling compare mode, initialize with current values
      setCompareAmount(amount);
      setCompareAmountInput(amountInput);
      setCompareTerm(term);
      setCompareInterestRate(interestRate + 1); // Slightly higher rate for comparison
      setCompareRateInput((interestRate + 1).toString());
    }
    setCompareMode(!compareMode);
  };

  // Render the chart for loan visualization
  const renderChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" label={{ value: "Tháng", position: "insideBottomRight", offset: -10 }} />
        <YAxis yAxisId="left" label={{ value: "Dư nợ", angle: -90, position: "insideLeft" }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: "Thanh toán", angle: 90, position: "insideRight" }} />
        <Tooltip formatter={(value) => formatCurrency(Number(value)) + "đ"} />
        <Legend />
        <Area yAxisId="left" type="monotone" dataKey="remainingA" name="Dư nợ gốc" stroke="#8884d8" fill="#8884d8" />
        {compareMode && (
          <Area yAxisId="left" type="monotone" dataKey="remainingB" name="Dư nợ gốc (so sánh)" stroke="#82ca9d" fill="#82ca9d" />
        )}
        <Bar yAxisId="right" dataKey="principalA" stackId="a" name="Gốc trả" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="interestA" stackId="a" name="Lãi trả" fill="#ffc658" />
        {compareMode && (
          <>
            <Bar yAxisId="right" dataKey="principalB" stackId="b" name="Gốc trả (so sánh)" fill="#82ca9d" />
            <Bar yAxisId="right" dataKey="interestB" stackId="b" name="Lãi trả (so sánh)" fill="#ff8042" />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mô phỏng khoản vay</CardTitle>
        <CardDescription>
          Mô phỏng và so sánh các kịch bản vay vốn khác nhau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Thông số cơ bản</TabsTrigger>
            <TabsTrigger value="advanced">Tùy chọn nâng cao</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Thông số khoản vay</h3>
              <Button 
                variant="outline" 
                onClick={toggleCompareMode} 
                className="flex items-center gap-2"
              >
                {compareMode ? "Tắt so sánh" : "Bật so sánh"}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Primary loan parameters */}
              <div className="space-y-6">
                {!compareMode && <h4 className="font-medium">Khoản vay</h4>}
                {compareMode && <h4 className="font-medium text-primary">Khoản vay A</h4>}
                
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
                        min={10000000} 
                        max={2000000000} 
                        step={5000000} 
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
                    min={12} 
                    max={360} 
                    step={12} 
                    value={[term]} 
                    onValueChange={handleTermChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interestRate">Lãi suất (%/năm)</Label>
                    <div className="text-sm text-muted-foreground">{interestRate}%</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Slider 
                        id="interestRate"
                        min={3} 
                        max={20} 
                        step={0.1} 
                        value={[interestRate]} 
                        onValueChange={(val) => setInterestRate(val[0])}
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
                </div>
              </div>
              
              {/* Comparison loan parameters (conditionally rendered) */}
              {compareMode && (
                <div className="space-y-6">
                  <h4 className="font-medium text-green-600">Khoản vay B</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="compareAmount">Số tiền vay</Label>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(compareAmount)} đ
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Slider 
                          id="compareAmount"
                          min={10000000} 
                          max={2000000000} 
                          step={5000000} 
                          value={[compareAmount]} 
                          onValueChange={(val) => {
                            setCompareAmount(val[0]);
                            setCompareAmountInput(formatNumber(val[0]));
                          }}
                        />
                      </div>
                      <div className="w-32">
                        <Input 
                          value={compareAmountInput}
                          onChange={(e) => {
                            setCompareAmountInput(e.target.value);
                            const parsed = parseAmount(e.target.value);
                            if (!isNaN(parsed)) setCompareAmount(parsed);
                          }}
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="compareTerm">Thời hạn vay</Label>
                      <div className="text-sm text-muted-foreground">
                        {compareTerm} tháng ({Math.floor(compareTerm / 12)} năm {compareTerm % 12} tháng)
                      </div>
                    </div>
                    <Slider 
                      id="compareTerm"
                      min={12} 
                      max={360} 
                      step={12} 
                      value={[compareTerm]} 
                      onValueChange={(val) => setCompareTerm(val[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="compareInterestRate">Lãi suất (%/năm)</Label>
                      <div className="text-sm text-muted-foreground">{compareInterestRate}%</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Slider 
                          id="compareInterestRate"
                          min={3} 
                          max={20} 
                          step={0.1} 
                          value={[compareInterestRate]} 
                          onValueChange={(val) => setCompareInterestRate(val[0])}
                        />
                      </div>
                      <div className="w-16">
                        <Input 
                          value={compareRateInput}
                          onChange={(e) => {
                            setCompareRateInput(e.target.value);
                            const parsed = parseFloat(e.target.value);
                            if (!isNaN(parsed)) setCompareInterestRate(parsed);
                          }}
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
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
                      Trả góp đều (gốc + lãi)
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
              
              <div className="space-y-2">
                <Label htmlFor="prepayment">Trả trước định kỳ</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Slider 
                      id="prepayment"
                      min={0} 
                      max={100000000} 
                      step={1000000} 
                      value={[prepaymentAmount]} 
                      onValueChange={(val) => setPrepaymentAmount(val[0])}
                    />
                  </div>
                  <div className="w-36">
                    <Input 
                      value={formatNumber(prepaymentAmount)}
                      onChange={(e) => {
                        const parsed = parseAmount(e.target.value);
                        if (!isNaN(parsed)) setPrepaymentAmount(parsed);
                      }}
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="text-sm text-right text-muted-foreground">
                  {formatCurrency(prepaymentAmount)} đ
                </div>
              </div>
              
              <div>
                <Label>Tần suất trả trước</Label>
                <RadioGroup 
                  value={prepaymentFrequency}
                  onValueChange={setPrepaymentFrequency}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <RadioGroupItem value="none" id="freq-none" />
                    <Label htmlFor="freq-none" className="font-normal cursor-pointer text-sm">
                      Không
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <RadioGroupItem value="yearly" id="freq-yearly" />
                    <Label htmlFor="freq-yearly" className="font-normal cursor-pointer text-sm">
                      Hàng năm
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <RadioGroupItem value="quarterly" id="freq-quarterly" />
                    <Label htmlFor="freq-quarterly" className="font-normal cursor-pointer text-sm">
                      Hàng quý
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-2 rounded-md">
                    <RadioGroupItem value="monthly" id="freq-monthly" />
                    <Label htmlFor="freq-monthly" className="font-normal cursor-pointer text-sm">
                      Hàng tháng
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Results section */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Kết quả mô phỏng</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`bg-gray-50 p-4 rounded-lg ${compareMode ? 'border-l-4 border-primary' : ''}`}>
              <div className="text-sm text-muted-foreground">
                {compareMode ? 'A: ' : ''}Trả hàng tháng
              </div>
              <div className="text-lg font-bold">{formatCurrency(loanResult.monthlyPayment)} đ</div>
            </div>
            <div className={`bg-gray-50 p-4 rounded-lg ${compareMode ? 'border-l-4 border-primary' : ''}`}>
              <div className="text-sm text-muted-foreground">
                {compareMode ? 'A: ' : ''}Tổng tiền lãi
              </div>
              <div className="text-lg font-bold">{formatCurrency(loanResult.totalInterest)} đ</div>
            </div>
            <div className={`bg-gray-50 p-4 rounded-lg ${compareMode ? 'border-l-4 border-primary' : ''}`}>
              <div className="text-sm text-muted-foreground">
                {compareMode ? 'A: ' : ''}Tổng phải trả
              </div>
              <div className="text-lg font-bold">{formatCurrency(loanResult.totalPayment)} đ</div>
            </div>
            
            {compareMode && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-muted-foreground">B: Trả hàng tháng</div>
                  <div className="text-lg font-bold">{formatCurrency(compareLoanResult.monthlyPayment)} đ</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-muted-foreground">B: Tổng tiền lãi</div>
                  <div className="text-lg font-bold">{formatCurrency(compareLoanResult.totalInterest)} đ</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-muted-foreground">B: Tổng phải trả</div>
                  <div className="text-lg font-bold">{formatCurrency(compareLoanResult.totalPayment)} đ</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg col-span-3">
                  <div className="text-sm text-muted-foreground">Chênh lệch tiền lãi</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(Math.abs(loanResult.totalInterest - compareLoanResult.totalInterest))} đ
                    {loanResult.totalInterest > compareLoanResult.totalInterest 
                      ? ' (B tiết kiệm hơn)' 
                      : ' (A tiết kiệm hơn)'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Visualization section */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Biểu đồ khoản vay</h3>
          {renderChart()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.print()}>In mô phỏng</Button>
        <Button onClick={handleSaveLoan}>Lưu khoản vay này</Button>
      </CardFooter>
    </Card>
  );
};

export default LoanSimulator;
