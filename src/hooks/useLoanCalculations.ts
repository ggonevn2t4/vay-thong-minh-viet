
import { useState, useEffect } from 'react';
import { calculateLoan, generateRepaymentSchedule } from '@/lib/utils';

export const useLoanCalculations = (
  amount: number,
  interestRate: number,
  term: number,
  paymentType: string
) => {
  const [loanResult, setLoanResult] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
  });
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    // Calculate loan details
    const result = calculateLoan(amount, interestRate, term / 12);
    setLoanResult(result);

    // Generate repayment schedule
    const repaymentSchedule = generateRepaymentSchedule(amount, interestRate, term / 12);
    setSchedule(repaymentSchedule.slice(0, 5)); // Show first 5 payments only
  }, [amount, term, interestRate, paymentType]);

  return { loanResult, schedule };
};
