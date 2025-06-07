
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useLoanForm } from '@/hooks/useLoanForm';
import { useLoanCalculations } from '@/hooks/useLoanCalculations';
import LoanTypeSelector from './loan-calculator/LoanTypeSelector';
import LoanInputs from './loan-calculator/LoanInputs';
import PaymentOptions from './loan-calculator/PaymentOptions';
import LoanResults from './loan-calculator/LoanResults';

interface LoanCalculatorProps {
  /** Optional CSS classes for styling */
  className?: string;
}

/**
 * Main loan calculator component
 * Provides interactive loan calculation with tabs for basic and advanced options
 * @param {LoanCalculatorProps} props - The component props
 * @returns {JSX.Element} The complete loan calculator interface
 */
const LoanCalculator = ({ className }: LoanCalculatorProps) => {
  const {
    amount,
    amountInput,
    term,
    interestRate,
    rateInput,
    paymentType,
    loanType,
    collateral,
    setPaymentType,
    setLoanType,
    setCollateral,
    handleAmountChange,
    handleAmountInputChange,
    handleRateInputChange,
    handleTermChange,
  } = useLoanForm();

  const { loanResult, schedule } = useLoanCalculations(amount, interestRate, term, paymentType);

  /**
   * Reset all form values to defaults
   */
  const handleReset = () => {
    // This would need to be implemented in the useLoanForm hook
    console.log('Reset calculator values');
  };

  /**
   * Navigate to loan registration page
   */
  const handleRegister = () => {
    // This would navigate to the loan registration flow
    console.log('Navigate to loan registration');
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
            <LoanTypeSelector 
              loanType={loanType}
              onLoanTypeChange={setLoanType}
            />

            <LoanInputs
              amount={amount}
              amountInput={amountInput}
              term={term}
              interestRate={interestRate}
              rateInput={rateInput}
              onAmountChange={handleAmountChange}
              onAmountInputChange={handleAmountInputChange}
              onTermChange={handleTermChange}
              onRateInputChange={handleRateInputChange}
              onRateChange={(value) => setInterestRate(value[0])}
            />
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            <PaymentOptions
              paymentType={paymentType}
              collateral={collateral}
              onPaymentTypeChange={setPaymentType}
              onCollateralChange={setCollateral}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <LoanResults
            loanResult={loanResult}
            schedule={schedule}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Đặt lại
        </Button>
        <Button onClick={handleRegister}>
          Đăng ký khoản vay
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoanCalculator;
