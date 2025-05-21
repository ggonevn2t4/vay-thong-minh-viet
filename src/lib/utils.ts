
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency function
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

// Tính toán khoản vay
export function calculateLoan(
  principal: number,
  interestRate: number,
  termInYears: number
) {
  // Chuyển lãi suất hàng năm thành lãi suất hàng tháng
  const monthlyRate = interestRate / 100 / 12;
  // Chuyển kỳ hạn từ năm sang tháng
  const termInMonths = termInYears * 12;
  
  // Tính toán khoản thanh toán hàng tháng (công thức PMT)
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                        (Math.pow(1 + monthlyRate, termInMonths) - 1);
  
  // Tổng số tiền thanh toán
  const totalPayment = monthlyPayment * termInMonths;
  
  // Tổng tiền lãi
  const totalInterest = totalPayment - principal;
  
  return {
    monthlyPayment,
    totalPayment,
    totalInterest
  };
}

// Generate lịch trả nợ
export function generateRepaymentSchedule(
  principal: number,
  interestRate: number,
  termInYears: number
) {
  const monthlyRate = interestRate / 100 / 12;
  const termInMonths = termInYears * 12;
  const monthlyPayment = calculateLoan(principal, interestRate, termInYears).monthlyPayment;
  
  let schedule = [];
  let remainingPrincipal = principal;
  let totalInterestPaid = 0;
  
  for (let month = 1; month <= termInMonths; month++) {
    // Tính tiền lãi hàng tháng
    const interestPayment = remainingPrincipal * monthlyRate;
    // Tính tiền gốc trả trong tháng
    const principalPayment = monthlyPayment - interestPayment;
    
    // Cập nhật dư nợ gốc
    remainingPrincipal -= principalPayment;
    totalInterestPaid += interestPayment;
    
    // Xử lý làm tròn số cho tháng cuối
    let actualRemainingPrincipal = remainingPrincipal;
    if (month === termInMonths) {
      actualRemainingPrincipal = 0;
    }
    
    // Thêm vào lịch trả nợ
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

// Kiểm tra định dạng email
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

// Kiểm tra định dạng số điện thoại
export function isValidPhoneNumber(phone: string): boolean {
  const regex = /^(0|\+84)\d{9,10}$/;
  return regex.test(phone);
}

// Chuyển đổi số tiền thành định dạng có phân cách
export function formatNumber(num: number | string): string {
  const parsedNum = typeof num === 'string' ? parseFloat(num.replace(/[^\d.-]/g, '')) : num;
  
  if (isNaN(parsedNum)) {
    return '0';
  }
  
  return parsedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Phân tích chuỗi số tiền thành số
export function parseAmount(amountStr: string): number {
  // Loại bỏ tất cả các ký tự không phải số
  const cleanStr = amountStr.replace(/[^\d]/g, '');
  return parseInt(cleanStr, 10) || 0;
}

// Tính toán xếp hạng tín dụng đơn giản
export function calculateCreditScore(userData: any): number {
  let score = 0;
  
  // Thu nhập
  if (userData.income > 20000000) score += 25;
  else if (userData.income > 10000000) score += 20;
  else if (userData.income > 5000000) score += 15;
  else score += 5;
  
  // Thời gian làm việc
  if (userData.workExperience > 36) score += 20; // > 3 năm
  else if (userData.workExperience > 12) score += 15; // 1-3 năm
  else score += 5; // < 1 năm
  
  // Tài sản đảm bảo
  if (userData.hasCollateral) score += 20;
  
  // Lịch sử tín dụng
  if (!userData.hasExistingLoan) score += 15;
  else score += 10;
  
  // Nợ xấu
  if (userData.hasBadDebt) score -= 30;
  
  return Math.max(0, score);
}
