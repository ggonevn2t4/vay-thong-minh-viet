
import { useState, useEffect } from 'react';
import { calculateLoan, generateRepaymentSchedule } from '@/lib/utils';

/**
 * Custom hook for loan calculations
 * Automatically recalculates loan details when input parameters change
 * @param {number} amount - Loan amount
 * @param {number} interestRate - Annual interest rate as percentage
 * @param {number} term - Loan term in months
 * @param {string} paymentType - Type of payment schedule
 * @returns {Object} Loan calculation results and repayment schedule
 */
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

    // Generate repayment schedule (show first 5 payments only)
    const repaymentSchedule = generateRepaymentSchedule(amount, interestRate, term / 12);
    setSchedule(repaymentSchedule.slice(0, 5));
  }, [amount, term, interestRate, paymentType]);

  return { loanResult, schedule };
};
