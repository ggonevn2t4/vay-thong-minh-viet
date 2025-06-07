
import { useState } from 'react';
import { formatNumber, parseAmount } from '@/lib/utils';

/**
 * Default form values
 */
const DEFAULT_VALUES = {
  AMOUNT: 100000000,
  TERM: 12,
  INTEREST_RATE: 10,
  PAYMENT_TYPE: "equal-payment",
  LOAN_TYPE: "personal",
  COLLATERAL: false
};

/**
 * Custom hook for loan form state management
 * Handles all form inputs and their validation/formatting
 * @returns {Object} Form state values and handlers
 */
export const useLoanForm = () => {
  // Form state
  const [amount, setAmount] = useState<number>(DEFAULT_VALUES.AMOUNT);
  const [amountInput, setAmountInput] = useState<string>(formatNumber(DEFAULT_VALUES.AMOUNT));
  const [term, setTerm] = useState<number>(DEFAULT_VALUES.TERM);
  const [interestRate, setInterestRate] = useState<number>(DEFAULT_VALUES.INTEREST_RATE);
  const [rateInput, setRateInput] = useState<string>(DEFAULT_VALUES.INTEREST_RATE.toString());
  const [paymentType, setPaymentType] = useState<string>(DEFAULT_VALUES.PAYMENT_TYPE);
  const [loanType, setLoanType] = useState<string>(DEFAULT_VALUES.LOAN_TYPE);
  const [collateral, setCollateral] = useState<boolean>(DEFAULT_VALUES.COLLATERAL);

  /**
   * Handle loan amount changes from slider
   * @param {number[]} newAmount - New amount value from slider
   */
  const handleAmountChange = (newAmount: number[]) => {
    setAmount(newAmount[0]);
    setAmountInput(formatNumber(newAmount[0]));
  };

  /**
   * Handle loan amount input changes from text field
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountInput(value);
    
    const parsedAmount = parseAmount(value);
    if (!isNaN(parsedAmount)) {
      setAmount(parsedAmount);
    }
  };

  /**
   * Handle interest rate input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRateInput(value);
    
    const parsedRate = parseFloat(value);
    if (!isNaN(parsedRate)) {
      setInterestRate(parsedRate);
    }
  };

  /**
   * Handle loan term changes from slider
   * @param {number[]} newTerm - New term value from slider
   */
  const handleTermChange = (newTerm: number[]) => {
    setTerm(newTerm[0]);
  };

  return {
    // State values
    amount,
    amountInput,
    term,
    interestRate,
    rateInput,
    paymentType,
    loanType,
    collateral,
    
    // Setters
    setPaymentType,
    setLoanType,
    setCollateral,
    setInterestRate,
    
    // Handlers
    handleAmountChange,
    handleAmountInputChange,
    handleRateInputChange,
    handleTermChange,
  };
};
