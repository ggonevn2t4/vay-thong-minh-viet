
import { useState } from 'react';
import { formatNumber, parseAmount } from '@/lib/utils';

export const useLoanForm = () => {
  const [amount, setAmount] = useState<number>(100000000);
  const [amountInput, setAmountInput] = useState<string>("100.000.000");
  const [term, setTerm] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [rateInput, setRateInput] = useState<string>("10");
  const [paymentType, setPaymentType] = useState<string>("equal-payment");
  const [loanType, setLoanType] = useState<string>("personal");
  const [collateral, setCollateral] = useState<boolean>(false);

  const handleAmountChange = (newAmount: number[]) => {
    setAmount(newAmount[0]);
    setAmountInput(formatNumber(newAmount[0]));
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountInput(value);
    
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

  return {
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
  };
};
