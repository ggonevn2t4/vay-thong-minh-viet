// Enhanced loan eligibility calculation utilities
// Implements more detailed scoring algorithm with multiple factors

import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils"; // Corrected import path

// Expanded loan eligibility form data interface
export interface EnhancedEligibilityFormData {
  // Basic information
  monthlyIncome: number;
  age: number;
  creditHistory: string;
  employmentType: string;
  existingDebts: number;
  loanAmount: number;
  loanTerm: number;
  
  // Enhanced information
  occupation: string;
  yearsEmployed: number;
  collateralValue: number;
  hasCoBorrower: boolean;
  dependents: number;
  loanPurpose: string;
  housingType: string;
  monthlyExpenses: number;
  previousLoans: number;
  previousLoansRepaid: number;
}

// Detailed bank lending criteria
export interface BankLendingCriteria {
  id: string;
  name: string;
  logo: string;
  minCreditScore: number;
  minIncome: number;
  maxDTI: number; // Debt-to-income ratio
  maxLTV: number; // Loan-to-value ratio
  minEmploymentYears: number;
  preferredOccupations: string[];
  preferredLoanPurposes: string[];
  interestRates: BankInterestRate[];
  fees: BankFees;
  processingTime: string;
  requirements: string[];
  benefits: string[];
}

// Real interest rates based on credit profile
export interface BankInterestRate {
  creditScoreRange: [number, number];
  baseRate: number;
  loanAmountAdjustments: {min: number, max: number, adjustment: number}[];
  termAdjustments: {min: number, max: number, adjustment: number}[];
  occupationAdjustments: {[key: string]: number};
  collateralAdjustments: {min: number, max: number, adjustment: number}[];
}

// Bank fees structure
export interface BankFees {
  originationFee: number | {min: number, max: number, percentage: boolean};
  earlyRepaymentFee: number | {period: number, percentage: number};
  lateFee: number | {percentage: number, minAmount: number};
  serviceFees: {description: string, amount: number, frequency: string}[];
}

// Sample lending criteria for actual banks in Vietnam
export const bankLendingCriteria: BankLendingCriteria[] = [
  {
    id: "vcb",
    name: "Vietcombank",
    logo: "/vietcombank.png",
    minCreditScore: 65,
    minIncome: 8000000,
    maxDTI: 0.45,
    maxLTV: 0.75,
    minEmploymentYears: 1,
    preferredOccupations: ["government", "finance", "technology", "healthcare"],
    preferredLoanPurposes: ["home", "education", "vehicle"],
    interestRates: [
      {
        creditScoreRange: [80, 100],
        baseRate: 7.5,
        loanAmountAdjustments: [
          {min: 0, max: 500000000, adjustment: 0},
          {min: 500000001, max: 1000000000, adjustment: -0.1},
          {min: 1000000001, max: 3000000000, adjustment: -0.2}
        ],
        termAdjustments: [
          {min: 1, max: 5, adjustment: -0.3},
          {min: 6, max: 10, adjustment: 0},
          {min: 11, max: 20, adjustment: 0.5},
          {min: 21, max: 30, adjustment: 1.0}
        ],
        occupationAdjustments: {
          "government": -0.2,
          "finance": -0.3,
          "technology": -0.1,
          "healthcare": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 1.5},
          {min: 1, max: 1000000000, adjustment: 0.5},
          {min: 1000000001, max: 3000000000, adjustment: -0.2},
          {min: 3000000001, max: Infinity, adjustment: -0.5}
        ]
      },
      {
        creditScoreRange: [60, 79],
        baseRate: 8.8,
        loanAmountAdjustments: [
          {min: 0, max: 500000000, adjustment: 0},
          {min: 500000001, max: 1000000000, adjustment: -0.1},
          {min: 1000000001, max: 3000000000, adjustment: -0.15}
        ],
        termAdjustments: [
          {min: 1, max: 5, adjustment: -0.2},
          {min: 6, max: 10, adjustment: 0},
          {min: 11, max: 20, adjustment: 0.7},
          {min: 21, max: 30, adjustment: 1.2}
        ],
        occupationAdjustments: {
          "government": -0.1,
          "finance": -0.2,
          "technology": -0.1,
          "healthcare": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 1.8},
          {min: 1, max: 1000000000, adjustment: 0.7},
          {min: 1000000001, max: 3000000000, adjustment: 0},
          {min: 3000000001, max: Infinity, adjustment: -0.3}
        ]
      },
      {
        creditScoreRange: [0, 59],
        baseRate: 10.5,
        loanAmountAdjustments: [
          {min: 0, max: 300000000, adjustment: 0},
          {min: 300000001, max: 700000000, adjustment: 0.1}
        ],
        termAdjustments: [
          {min: 1, max: 5, adjustment: -0.1},
          {min: 6, max: 10, adjustment: 0.2},
          {min: 11, max: 20, adjustment: 1.0},
          {min: 21, max: 30, adjustment: 1.5}
        ],
        occupationAdjustments: {
          "government": 0,
          "finance": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 2.5},
          {min: 1, max: 1000000000, adjustment: 1.0},
          {min: 1000000001, max: 3000000000, adjustment: 0.5}
        ]
      }
    ],
    fees: {
      originationFee: {min: 0.5, max: 1.0, percentage: true},
      earlyRepaymentFee: {period: 36, percentage: 2},
      lateFee: {percentage: 1.5, minAmount: 150000},
      serviceFees: [
        {description: "Phí thẩm định", amount: 500000, frequency: "once"},
        {description: "Phí hành chính", amount: 50000, frequency: "monthly"}
      ]
    },
    processingTime: "3-5 ngày làm việc",
    requirements: [
      "CMND/CCCD còn hiệu lực",
      "Hợp đồng lao động có thời hạn tối thiểu 12 tháng",
      "Sao kê lương 3 tháng gần nhất",
      "Sổ hộ khẩu/Giấy đăng ký tạm trú"
    ],
    benefits: [
      "Lãi suất ưu đãi 6 tháng đầu",
      "Thời gian xét duyệt nhanh",
      "Ưu đãi giảm lãi suất cho khách hàng VIP",
      "Miễn phí quản lý tài khoản"
    ]
  },
  {
    id: "tcb",
    name: "Techcombank",
    logo: "/techcombank.png",
    minCreditScore: 63,
    minIncome: 7000000,
    maxDTI: 0.5,
    maxLTV: 0.8,
    minEmploymentYears: 0.5,
    preferredOccupations: ["finance", "technology", "international", "business"],
    preferredLoanPurposes: ["home", "business", "investment"],
    interestRates: [
      {
        creditScoreRange: [80, 100],
        baseRate: 7.2,
        loanAmountAdjustments: [
          {min: 0, max: 500000000, adjustment: 0},
          {min: 500000001, max: 1000000000, adjustment: -0.2},
          {min: 1000000001, max: 3000000000, adjustment: -0.3}
        ],
        termAdjustments: [
          {min: 1, max: 5, adjustment: -0.4},
          {min: 6, max: 10, adjustment: 0},
          {min: 11, max: 20, adjustment: 0.4},
          {min: 21, max: 30, adjustment: 0.9}
        ],
        occupationAdjustments: {
          "international": -0.3,
          "finance": -0.3,
          "technology": -0.2,
          "business": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 1.3},
          {min: 1, max: 1000000000, adjustment: 0.4},
          {min: 1000000001, max: 3000000000, adjustment: -0.3},
          {min: 3000000001, max: Infinity, adjustment: -0.6}
        ]
      },
      {
        creditScoreRange: [60, 79],
        baseRate: 8.5,
        loanAmountAdjustments: [
          {min: 0, max: 500000000, adjustment: 0},
          {min: 500000001, max: 1000000000, adjustment: -0.1},
          {min: 1000000001, max: 3000000000, adjustment: -0.2}
        ],
        termAdjustments: [
          {min: 1, max: 5, adjustment: -0.3},
          {min: 6, max: 10, adjustment: 0},
          {min: 11, max: 20, adjustment: 0.6},
          {min: 21, max: 30, adjustment: 1.1}
        ],
        occupationAdjustments: {
          "international": -0.2,
          "finance": -0.2,
          "technology": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 1.5},
          {min: 1, max: 1000000000, adjustment: 0.6},
          {min: 1000000001, max: 3000000000, adjustment: -0.1},
          {min: 3000000001, max: Infinity, adjustment: -0.4}
        ]
      },
      {
        creditScoreRange: [0, 59],
        baseRate: 10.2,
        loanAmountAdjustments: [
          {min: 0, max: 300000000, adjustment: 0},
          {min: 300000001, max: 700000000, adjustment: 0.2}
        ],
        termAdjustments: [
          {min: 1, max: 5, adjustment: -0.1},
          {min: 6, max: 10, adjustment: 0.3},
          {min: 11, max: 20, adjustment: 0.9},
          {min: 21, max: 30, adjustment: 1.4}
        ],
        occupationAdjustments: {
          "international": -0.1,
          "finance": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 2.3},
          {min: 1, max: 1000000000, adjustment: 0.9},
          {min: 1000000001, max: 3000000000, adjustment: 0.4}
        ]
      }
    ],
    fees: {
      originationFee: {min: 0.5, max: 1.0, percentage: true},
      earlyRepaymentFee: {period: 24, percentage: 3},
      lateFee: {percentage: 1.5, minAmount: 200000},
      serviceFees: [
        {description: "Phí thẩm định", amount: 600000, frequency: "once"},
        {description: "Phí duy trì khoản vay", amount: 55000, frequency: "monthly"}
      ]
    },
    processingTime: "3-7 ngày làm việc",
    requirements: [
      "CMND/CCCD còn hiệu lực",
      "Hợp đồng lao động",
      "Sao kê lương 6 tháng gần nhất",
      "Hóa đơn điện/nước để xác minh địa chỉ"
    ],
    benefits: [
      "Giải ngân nhanh trong 24h sau khi được duyệt",
      "Nhiều ưu đãi cho khách hàng mới", 
      "Miễn phí tất toán khoản vay sau 3 năm",
      "Chương trình tích điểm đổi quà"
    ]
  },
  {
    id: "tpb",
    name: "TPBank",
    logo: "/tpbank.png",
    minCreditScore: 60,
    minIncome: 5000000,
    maxDTI: 0.55,
    maxLTV: 0.75,
    minEmploymentYears: 0.25,
    preferredOccupations: ["business", "retail", "service", "education"],
    preferredLoanPurposes: ["home", "vehicle", "education", "personal"],
    interestRates: [
      {
        creditScoreRange: [80, 100],
        baseRate: 7.8,
        loanAmountAdjustments: [
          {min: 0, max: 500000000, adjustment: 0},
          {min: 500000001, max: 1000000000, adjustment: -0.1}
        ],
        termAdjustments: [
          {min: 1, max: 3, adjustment: -0.5},
          {min: 4, max: 10, adjustment: 0},
          {min: 11, max: 15, adjustment: 0.3},
          {min: 16, max: 20, adjustment: 0.8}
        ],
        occupationAdjustments: {
          "business": -0.2,
          "education": -0.1,
          "service": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 1.4},
          {min: 1, max: 800000000, adjustment: 0.5},
          {min: 800000001, max: 2000000000, adjustment: -0.2},
          {min: 2000000001, max: Infinity, adjustment: -0.4}
        ]
      },
      {
        creditScoreRange: [60, 79],
        baseRate: 8.9,
        loanAmountAdjustments: [
          {min: 0, max: 300000000, adjustment: 0},
          {min: 300000001, max: 800000000, adjustment: -0.1}
        ],
        termAdjustments: [
          {min: 1, max: 3, adjustment: -0.3},
          {min: 4, max: 10, adjustment: 0},
          {min: 11, max: 15, adjustment: 0.5},
          {min: 16, max: 20, adjustment: 1.0}
        ],
        occupationAdjustments: {
          "business": -0.1
        },
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 1.7},
          {min: 1, max: 800000000, adjustment: 0.6},
          {min: 800000001, max: 2000000000, adjustment: 0}
        ]
      },
      {
        creditScoreRange: [0, 59],
        baseRate: 10.8,
        loanAmountAdjustments: [
          {min: 0, max: 200000000, adjustment: 0}
        ],
        termAdjustments: [
          {min: 1, max: 3, adjustment: -0.2},
          {min: 4, max: 10, adjustment: 0.1},
          {min: 11, max: 15, adjustment: 0.7}
        ],
        occupationAdjustments: {},
        collateralAdjustments: [
          {min: 0, max: 0, adjustment: 2.5},
          {min: 1, max: 500000000, adjustment: 1.0}
        ]
      }
    ],
    fees: {
      originationFee: {min: 0.8, max: 1.2, percentage: true},
      earlyRepaymentFee: {period: 12, percentage: 2},
      lateFee: {percentage: 1.6, minAmount: 180000},
      serviceFees: [
        {description: "Phí thẩm định", amount: 450000, frequency: "once"},
        {description: "Phí bảo hiểm khoản vay", amount: 0.3, frequency: "annual-percentage"}
      ]
    },
    processingTime: "2-3 ngày làm việc",
    requirements: [
      "CMND/CCCD còn hiệu lực",
      "Bảng lương hoặc xác nhận thu nhập",
      "Sao kê ngân hàng 3 tháng gần nhất"
    ],
    benefits: [
      "Giải ngân nhanh trong 24h",
      "Không cần chứng minh thu nhập với khoản vay nhỏ",
      "Ưu đãi lãi suất dành cho khách hàng mới",
      "Miễn phí trả nợ trước hạn sau 12 tháng"
    ]
  }
];

// Calculate enhanced eligibility score with more factors
export const calculateEnhancedEligibility = (formData: EnhancedEligibilityFormData): number => {
  // Base score starts at 40
  let score = 40;
  
  // Income factor (higher income = higher score) - more gradual curve
  if (formData.monthlyIncome >= 30000000) {
    score += 15;
  } else if (formData.monthlyIncome >= 20000000) {
    score += 12;
  } else if (formData.monthlyIncome >= 10000000) {
    score += 10;
  } else if (formData.monthlyIncome >= 7000000) {
    score += 7;
  } else if (formData.monthlyIncome >= 5000000) {
    score += 5;
  } else {
    score += Math.max(0, Math.min(3, formData.monthlyIncome / 2000000));
  }
  
  // Age factor (25-45 is ideal range)
  if (formData.age >= 25 && formData.age <= 45) {
    score += 5;
  } else if (formData.age > 45 && formData.age <= 55) {
    score += 3;
  } else if (formData.age > 55 && formData.age <= 60) {
    score += 1;
  } else if (formData.age > 60) {
    score -= 5;
  } else {
    // Under 25
    score += 1;
  }
  
  // Credit history
  if (formData.creditHistory === 'excellent') {
    score += 15;
  } else if (formData.creditHistory === 'good') {
    score += 10;
  } else if (formData.creditHistory === 'fair') {
    score += 5;
  } else if (formData.creditHistory === 'poor') {
    score -= 10;
  } else if (formData.creditHistory === 'none') {
    // No credit history
    score -= 5; 
  }
  
  // Employment type
  if (formData.employmentType === 'full-time') {
    score += 5;
  } else if (formData.employmentType === 'part-time') {
    score += 2;
  } else if (formData.employmentType === 'self-employed') {
    score += 3;
  } else if (formData.employmentType === 'contract') {
    score += 1;
  } else if (formData.employmentType === 'unemployed') {
    score -= 15;
  }
  
  // Employment years (stability)
  if (formData.yearsEmployed >= 10) {
    score += 10;
  } else if (formData.yearsEmployed >= 5) {
    score += 8;
  } else if (formData.yearsEmployed >= 3) {
    score += 5;
  } else if (formData.yearsEmployed >= 1) {
    score += 3;
  } else {
    score += 0;
  }
  
  // Debt to income ratio
  const monthlyDebtPayment = formData.existingDebts / 12; // Convert annual debt to monthly
  const debtToIncomeRatio = (monthlyDebtPayment + formData.monthlyExpenses) / (formData.monthlyIncome + 0.01);
  if (debtToIncomeRatio <= 0.3) {
    score += 10;
  } else if (debtToIncomeRatio <= 0.4) {
    score += 7;
  } else if (debtToIncomeRatio <= 0.5) {
    score += 3;
  } else if (debtToIncomeRatio <= 0.6) {
    score += 0;
  } else {
    score -= 5;
  }
  
  // Loan amount to income ratio
  const loanToIncomeRatio = formData.loanAmount / (formData.monthlyIncome * 12 + 0.01);
  if (loanToIncomeRatio <= 2) {
    score += 10;
  } else if (loanToIncomeRatio <= 3) {
    score += 7;
  } else if (loanToIncomeRatio <= 4) {
    score += 5;
  } else if (loanToIncomeRatio <= 5) {
    score += 2;
  } else if (loanToIncomeRatio <= 6) {
    score += 0;
  } else {
    score -= 5;
  }
  
  // Collateral value (if available)
  if (formData.collateralValue > 0) {
    const collateralCoverage = formData.collateralValue / formData.loanAmount;
    if (collateralCoverage >= 1.5) {
      score += 10;
    } else if (collateralCoverage >= 1.2) {
      score += 8;
    } else if (collateralCoverage >= 1.0) {
      score += 5;
    } else if (collateralCoverage >= 0.7) {
      score += 3;
    } else {
      score += 1;
    }
  }
  
  // Co-borrower
  if (formData.hasCoBorrower) {
    score += 5;
  }
  
  // Dependents (more dependents = more financial responsibility)
  if (formData.dependents <= 1) {
    score += 3;
  } else if (formData.dependents === 2) {
    score += 1;
  } else if (formData.dependents >= 3) {
    score -= 2;
  }
  
  // Previous loan repayment history
  if (formData.previousLoans > 0) {
    const repaymentRatio = formData.previousLoansRepaid / formData.previousLoans;
    if (repaymentRatio >= 1) {
      score += 10; // All loans repaid
    } else if (repaymentRatio >= 0.8) {
      score += 7;
    } else if (repaymentRatio >= 0.6) {
      score += 3;
    } else if (repaymentRatio >= 0.4) {
      score -= 2;
    } else {
      score -= 10;
    }
  }
  
  // Housing type (homeowner preferred)
  if (formData.housingType === 'own-outright') {
    score += 5;
  } else if (formData.housingType === 'own-mortgage') {
    score += 3;
  } else if (formData.housingType === 'rent') {
    score += 0;
  } else if (formData.housingType === 'living-with-family') {
    score += 1;
  } else {
    score += 0;
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
};

// Calculate real interest rate based on borrower profile and bank criteria
export const calculateRealInterestRate = (
  formData: EnhancedEligibilityFormData, 
  eligibilityScore: number,
  bank: BankLendingCriteria
): number | null => {
  // Find applicable interest rate tier based on credit score
  const applicableTier = bank.interestRates.find(tier => 
    eligibilityScore >= tier.creditScoreRange[0] && eligibilityScore <= tier.creditScoreRange[1]
  );
  
  if (!applicableTier) {
    return null; // No applicable tier found
  }
  
  // Start with base rate
  let interestRate = applicableTier.baseRate;
  
  // Apply loan amount adjustment
  const loanAmountAdjustment = applicableTier.loanAmountAdjustments.find(
    adj => formData.loanAmount >= adj.min && formData.loanAmount <= adj.max
  );
  if (loanAmountAdjustment) {
    interestRate += loanAmountAdjustment.adjustment;
  }
  
  // Apply term adjustment
  const termAdjustment = applicableTier.termAdjustments.find(
    adj => formData.loanTerm >= adj.min && formData.loanTerm <= adj.max
  );
  if (termAdjustment) {
    interestRate += termAdjustment.adjustment;
  }
  
  // Apply occupation adjustment if available
  if (formData.occupation in applicableTier.occupationAdjustments) {
    interestRate += applicableTier.occupationAdjustments[formData.occupation];
  }
  
  // Apply collateral adjustment
  const collateralAdjustment = applicableTier.collateralAdjustments.find(
    adj => formData.collateralValue >= adj.min && formData.collateralValue <= adj.max
  );
  if (collateralAdjustment) {
    interestRate += collateralAdjustment.adjustment;
  }
  
  // Ensure interest rate is reasonable
  return Math.max(5, Math.min(20, interestRate));
};

// Get bank match scores based on borrower profile
export const getBankMatchScores = (
  formData: EnhancedEligibilityFormData,
  eligibilityScore: number
): {bank: BankLendingCriteria, matchScore: number, interestRate: number | null}[] => {
  return bankLendingCriteria.map(bank => {
    // Start with base match score of 50
    let matchScore = 50;
    
    // Check minimum requirements
    if (eligibilityScore < bank.minCreditScore) {
      matchScore -= 30;
    } else if (eligibilityScore >= bank.minCreditScore + 20) {
      matchScore += 15;
    } else if (eligibilityScore >= bank.minCreditScore + 10) {
      matchScore += 10;
    } else if (eligibilityScore >= bank.minCreditScore + 5) {
      matchScore += 5;
    }
    
    // Check income requirement
    if (formData.monthlyIncome < bank.minIncome) {
      matchScore -= 20;
    } else if (formData.monthlyIncome >= bank.minIncome * 2) {
      matchScore += 10;
    } else if (formData.monthlyIncome >= bank.minIncome * 1.5) {
      matchScore += 7;
    } else if (formData.monthlyIncome >= bank.minIncome * 1.2) {
      matchScore += 5;
    }
    
    // Check debt-to-income ratio
    const monthlyDebtPayment = formData.existingDebts / 12;
    const dti = (monthlyDebtPayment + formData.monthlyExpenses) / (formData.monthlyIncome + 0.01);
    if (dti > bank.maxDTI) {
      matchScore -= 15;
    } else if (dti <= bank.maxDTI * 0.6) {
      matchScore += 10;
    } else if (dti <= bank.maxDTI * 0.8) {
      matchScore += 5;
    }
    
    // Check loan-to-value ratio if collateral exists
    if (formData.collateralValue > 0) {
      const ltv = formData.loanAmount / formData.collateralValue;
      if (ltv > bank.maxLTV) {
        matchScore -= 10;
      } else if (ltv <= bank.maxLTV * 0.7) {
        matchScore += 10;
      } else if (ltv <= bank.maxLTV * 0.85) {
        matchScore += 5;
      }
    } else {
      // No collateral is negative for secured loans
      matchScore -= 5;
    }
    
    // Check employment history
    if (formData.yearsEmployed < bank.minEmploymentYears) {
      matchScore -= 10;
    } else if (formData.yearsEmployed >= bank.minEmploymentYears * 3) {
      matchScore += 10;
    } else if (formData.yearsEmployed >= bank.minEmploymentYears * 2) {
      matchScore += 5;
    }
    
    // Check if occupation is preferred
    if (bank.preferredOccupations.includes(formData.occupation)) {
      matchScore += 10;
    }
    
    // Check if loan purpose is preferred
    if (bank.preferredLoanPurposes.includes(formData.loanPurpose)) {
      matchScore += 10;
    }
    
    // Real interest rate calculation
    const interestRate = calculateRealInterestRate(formData, eligibilityScore, bank);
    
    // Interest rate affects match score
    if (interestRate !== null) {
      if (interestRate <= 8) {
        matchScore += 10;
      } else if (interestRate <= 9) {
        matchScore += 5;
      } else if (interestRate >= 12) {
        matchScore -= 10;
      } else if (interestRate >= 11) {
        matchScore -= 5;
      }
    }
    
    // Ensure match score is between 0-100
    const finalMatchScore = Math.max(0, Math.min(100, matchScore));
    
    return {
      bank,
      matchScore: finalMatchScore,
      interestRate
    };
  }).sort((a, b) => b.matchScore - a.matchScore); // Sort by match score descending
};

// Get category based on eligibility score
export const getLoanEligibilityCategory = (score: number): string => {
  if (score >= 80) {
    return "Cao cấp";
  } else if (score >= 65) {
    return "Tiêu chuẩn";
  } else if (score >= 50) {
    return "Cơ bản";
  } else {
    return "Hạn chế";
  }
};

// Get score message based on eligibility score
export const getScoreMessage = (score: number): string => {
  if (score >= 80) {
    return "Khả năng vay vốn rất cao. Bạn có thể đủ điều kiện cho nhiều gói vay ưu đãi với lãi suất tốt nhất.";
  } else if (score >= 65) {
    return "Khả năng vay vốn khá tốt. Bạn có thể đủ điều kiện cho các gói vay thông thường với lãi suất hợp lý.";
  } else if (score >= 50) {
    return "Khả năng vay vốn trung bình. Bạn có thể cần cải thiện một số yếu tố để được duyệt với lãi suất tốt hơn.";
  } else {
    return "Khả năng vay vốn thấp. Bạn nên cải thiện tình hình tài chính trước khi vay để tránh lãi suất cao hoặc bị từ chối.";
  }
};

// Format money in VND
export const formatVND = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' VND';
};

// Calculate monthly payment with real interest rate
export const calculateMonthlyPayment = (
  principal: number,
  interestRate: number,
  termYears: number
): number => {
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = termYears * 12;
  
  if (monthlyRate === 0) {
    return principal / totalPayments;
  }
  
  const x = Math.pow(1 + monthlyRate, totalPayments);
  return (principal * monthlyRate * x) / (x - 1);
};

// Generate loan scheduler with real interest rate
export const generateLoanSchedule = (
  principal: number,
  interestRate: number,
  termYears: number
): Array<{
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}> => {
  const monthlyPayment = calculateMonthlyPayment(principal, interestRate, termYears);
  const schedule = [];
  let balance = principal;
  const monthlyRate = interestRate / 100 / 12;
  
  for (let period = 1; period <= termYears * 12; period++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    balance -= principalPayment;
    
    // Fix for floating point arithmetic
    if (period === termYears * 12) {
      balance = 0;
    }
    
    schedule.push({
      period,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, balance)
    });
    
    if (balance <= 0) break;
  }
  
  return schedule;
};

// Show loan warning if criteria are met
export const showLoanWarning = (formData: EnhancedEligibilityFormData): void => {
  const monthlyIncome = formData.monthlyIncome;
  const loanAmount = formData.loanAmount;
  const monthlyDebtPayment = formData.existingDebts / 12;
  
  if (loanAmount > monthlyIncome * 12 * 5) {
    toast.error("Cảnh báo khoản vay cao", {
      description: "Khoản vay yêu cầu vượt quá 5 lần thu nhập hàng năm của bạn, có thể gặp khó khăn khi duyệt.",
    });
  }
  
  if ((monthlyDebtPayment / monthlyIncome) > 0.5) {
    toast.error("Cảnh báo nợ hiện tại", {
      description: "Các khoản nợ hiện tại của bạn đã chiếm hơn 50% thu nhập, có thể khó được phê duyệt thêm khoản vay.",
    });
  }
};
