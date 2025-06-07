
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge and conditionally apply CSS classes
 * @param {...ClassValue[]} inputs - Class values to merge
 * @returns {string} Merged and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Vietnamese currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Calculate loan payment details using standard loan formulas
 * @param {number} principal - The loan principal amount
 * @param {number} interestRate - Annual interest rate (as percentage)
 * @param {number} termInYears - Loan term in years
 * @returns {Object} Object containing monthly payment, total payment, and total interest
 */
export function calculateLoan(
  principal: number,
  interestRate: number,
  termInYears: number
) {
  // Convert annual interest rate to monthly rate
  const monthlyRate = interestRate / 100 / 12;
  // Convert term from years to months
  const termInMonths = termInYears * 12;
  
  // Calculate monthly payment using PMT formula
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                        (Math.pow(1 + monthlyRate, termInMonths) - 1);
  
  // Calculate total payment and interest
  const totalPayment = monthlyPayment * termInMonths;
  const totalInterest = totalPayment - principal;
  
  return {
    monthlyPayment,
    totalPayment,
    totalInterest
  };
}

/**
 * Generate a detailed repayment schedule for a loan
 * @param {number} principal - The loan principal amount
 * @param {number} interestRate - Annual interest rate (as percentage)
 * @param {number} termInYears - Loan term in years
 * @returns {Array} Array of payment objects with monthly breakdown
 */
export function generateRepaymentSchedule(
  principal: number,
  interestRate: number,
  termInYears: number
) {
  const monthlyRate = interestRate / 100 / 12;
  const termInMonths = termInYears * 12;
  const monthlyPayment = calculateLoan(principal, interestRate, termInYears).monthlyPayment;
  
  const schedule = [];
  let remainingPrincipal = principal;
  
  for (let month = 1; month <= termInMonths; month++) {
    // Calculate monthly interest and principal payments
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    // Update remaining principal
    remainingPrincipal -= principalPayment;
    
    // Handle rounding for final month
    let actualRemainingPrincipal = remainingPrincipal;
    if (month === termInMonths) {
      actualRemainingPrincipal = 0;
    }
    
    // Add to repayment schedule
    schedule.push({
      month,
      principalPayment,
      interestPayment,
      totalPayment: principalPayment + interestPayment,
      remainingPrincipal: actualRemainingPrincipal
    });
  }
  
  return schedule;
}

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

/**
 * Validate Vietnamese phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number format is valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  const regex = /^(0|\+84)\d{9,10}$/;
  return regex.test(phone);
}

/**
 * Format a number with thousand separators (dots)
 * @param {number | string} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num: number | string): string {
  const parsedNum = typeof num === 'string' ? parseFloat(num.replace(/[^\d.-]/g, '')) : num;
  
  if (isNaN(parsedNum)) {
    return '0';
  }
  
  return parsedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Parse a formatted amount string to a number
 * @param {string} amountStr - Formatted amount string
 * @returns {number} Parsed number value
 */
export function parseAmount(amountStr: string): number {
  // Remove all non-digit characters
  const cleanStr = amountStr.replace(/[^\d]/g, '');
  return parseInt(cleanStr, 10) || 0;
}

/**
 * Calculate a simple credit score based on user data
 * @param {any} userData - User financial data object
 * @returns {number} Calculated credit score (0-100)
 */
export function calculateCreditScore(userData: any): number {
  let score = 0;
  
  // Income scoring (max 25 points)
  if (userData.income > 20000000) score += 25;
  else if (userData.income > 10000000) score += 20;
  else if (userData.income > 5000000) score += 15;
  else score += 5;
  
  // Work experience scoring (max 20 points)
  if (userData.workExperience > 36) score += 20; // > 3 years
  else if (userData.workExperience > 12) score += 15; // 1-3 years
  else score += 5; // < 1 year
  
  // Collateral scoring (max 20 points)
  if (userData.hasCollateral) score += 20;
  
  // Credit history scoring (max 15 points)
  if (!userData.hasExistingLoan) score += 15;
  else score += 10;
  
  // Bad debt penalty (max -30 points)
  if (userData.hasBadDebt) score -= 30;
  
  return Math.max(0, score);
}
