import { LoanProductType, CustomQuestionForm } from '@/types/loan-application-flow';

// Optimized questionnaire structure with conditional logic and smart categorization
export interface OptimizedQuestion {
  id: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'slider' | 'currency' | 'phone' | 'email' | 'id_number';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
    maxLength?: number;
    minLength?: number;
  };
  options?: string[];
  category: 'basic' | 'financial' | 'employment' | 'credit' | 'product_specific' | 'additional' | 'collateral' | 'family';
  priority: 'high' | 'medium' | 'low'; // For progressive disclosure
  dependsOn?: string; // Field ID that this question depends on
  showWhen?: (value: any) => boolean; // Conditional logic
  helpText?: string; // Additional guidance for users
  icon?: string; // Icon for visual enhancement
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    marks?: { value: number; label: string }[];
  };
  conditionalSections?: {
    condition: (value: any) => boolean;
    questions: OptimizedQuestion[];
  }[];
}

export interface OptimizedQuestionForm {
  productType: LoanProductType;
  title: string;
  description: string;
  estimatedTime: string; // "5-7 phút"
  categories: {
    id: string;
    name: string;
    description: string;
    icon: string;
    questions: OptimizedQuestion[];
  }[];
  smartValidation: {
    creditScoreEstimation: boolean;
    incomeVerification: boolean;
    riskAssessment: boolean;
  };
}

// Credit Card Questionnaire (Optimized)
const creditCardQuestionnaire: OptimizedQuestionForm = {
  productType: 'credit_loan',
  title: 'Đăng ký Thẻ Tín Dụng',
  description: 'Hoàn thành thông tin để nhận đề xuất thẻ tín dụng phù hợp nhất',
  estimatedTime: '5-7 phút',
  categories: [
    {
      id: 'product_specific',
      name: 'Thông tin thẻ mong muốn',
      description: 'Cho chúng tôi biết loại thẻ bạn quan tâm',
      icon: '💳',
      questions: [
        {
          id: 'desired_credit_limit',
          type: 'select',
          label: 'Hạn mức thẻ mong muốn',
          required: true,
          options: [
            '5-10 triệu VNĐ',
            '10-20 triệu VNĐ', 
            '20-50 triệu VNĐ',
            '50-100 triệu VNĐ',
            'Trên 100 triệu VNĐ'
          ],
          category: 'product_specific',
          priority: 'high',
          helpText: 'Chọn mức hạn mức phù hợp với khả năng tài chính của bạn',
          icon: '💰'
        },
        {
          id: 'card_usage_purpose',
          type: 'checkbox',
          label: 'Mục đích sử dụng thẻ chính',
          required: true,
          options: [
            'Mua sắm hàng ngày',
            'Du lịch trong nước',
            'Du lịch quốc tế',
            'Thanh toán online',
            'Rút tiền mặt',
            'Tích điểm đổi quà'
          ],
          category: 'product_specific',
          priority: 'high',
          helpText: 'Chọn tối đa 3 mục đích chính để nhận đề xuất phù hợp',
          icon: '🛍️'
        },
        {
          id: 'preferred_card_brand',
          type: 'select',
          label: 'Thương hiệu thẻ ưu tiên',
          required: false,
          options: ['Visa', 'Mastercard', 'JCB', 'Không có ưu tiên đặc biệt'],
          category: 'product_specific',
          priority: 'medium',
          icon: '🏷️'
        }
      ]
    },
    {
      id: 'basic',
      name: 'Thông tin cá nhân',
      description: 'Thông tin cơ bản để xác minh danh tính',
      icon: '👤',
      questions: [
        {
          id: 'full_name',
          type: 'text',
          label: 'Họ và tên',
          placeholder: 'Nguyễn Văn A',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^[a-zA-ZÀ-ỹ\\s]{2,50}$',
            message: 'Họ tên phải từ 2-50 ký tự, chỉ chứa chữ cái'
          },
          icon: '👤'
        },
        {
          id: 'phone_number',
          type: 'text',
          label: 'Số điện thoại',
          placeholder: '0901234567',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^(0|\\+84)[3-9][0-9]{8}$',
            message: 'Số điện thoại không hợp lệ'
          },
          icon: '📱'
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'example@email.com',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
            message: 'Email không hợp lệ'
          },
          icon: '📧'
        },
        {
          id: 'id_number',
          type: 'text',
          label: 'Số CMND/CCCD',
          placeholder: '123456789012',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^[0-9]{9,12}$',
            message: 'CMND/CCCD phải có 9-12 chữ số'
          },
          icon: '🆔'
        },
        {
          id: 'date_of_birth',
          type: 'date',
          label: 'Ngày sinh',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            min: 18, // Minimum age
            max: 65, // Maximum age
            message: 'Tuổi phải từ 18-65'
          },
          icon: '📅'
        }
      ]
    },
    {
      id: 'financial',
      name: 'Thông tin tài chính',
      description: 'Thu nhập và tình hình tài chính hiện tại',
      icon: '💰',
      questions: [
        {
          id: 'monthly_income',
          type: 'select',
          label: 'Thu nhập hàng tháng',
          required: true,
          options: [
            'Dưới 10 triệu VNĐ',
            '10-20 triệu VNĐ',
            '20-30 triệu VNĐ',
            '30-50 triệu VNĐ',
            '50-100 triệu VNĐ',
            'Trên 100 triệu VNĐ'
          ],
          category: 'financial',
          priority: 'high',
          helpText: 'Bao gồm lương, kinh doanh và các khoản thu nhập khác',
          icon: '💵'
        },
        {
          id: 'income_stability',
          type: 'select',
          label: 'Tính ổn định của thu nhập',
          required: true,
          options: [
            'Rất ổn định (lương cố định)',
            'Ổn định (có biến động nhẹ)',
            'Không ổn định (thu nhập theo dự án)',
            'Mới bắt đầu có thu nhập'
          ],
          category: 'financial',
          priority: 'high',
          icon: '📊'
        },
        {
          id: 'monthly_expenses',
          type: 'select',
          label: 'Chi phí sinh hoạt hàng tháng',
          required: true,
          options: [
            'Dưới 5 triệu VNĐ',
            '5-10 triệu VNĐ',
            '10-20 triệu VNĐ',
            '20-30 triệu VNĐ',
            'Trên 30 triệu VNĐ'
          ],
          category: 'financial',
          priority: 'medium',
          helpText: 'Bao gồm ăn uống, nhà ở, di chuyển, giải trí',
          icon: '🏠'
        }
      ]
    },
    {
      id: 'employment',
      name: 'Thông tin nghề nghiệp',
      description: 'Tình trạng việc làm và nơi làm việc',
      icon: '💼',
      questions: [
        {
          id: 'employment_type',
          type: 'select',
          label: 'Loại hình việc làm',
          required: true,
          options: [
            'Nhân viên chính thức',
            'Nhân viên hợp đồng',
            'Kinh doanh tự do',
            'Freelancer',
            'Sinh viên có thu nhập',
            'Nghỉ hưu có lương hưu'
          ],
          category: 'employment',
          priority: 'high',
          icon: '👔'
        },
        {
          id: 'work_experience',
          type: 'select',
          label: 'Kinh nghiệm làm việc',
          required: true,
          options: [
            'Dưới 1 năm',
            '1-3 năm',
            '3-5 năm',
            '5-10 năm',
            'Trên 10 năm'
          ],
          category: 'employment',
          priority: 'medium',
          icon: '⏳'
        },
        {
          id: 'company_type',
          type: 'select',
          label: 'Loại doanh nghiệp',
          required: false,
          options: [
            'Công ty nhà nước',
            'Công ty tư nhân',
            'Công ty nước ngoài',
            'Doanh nghiệp tư nhân',
            'Cơ quan chính phủ',
            'Tổ chức phi lợi nhuận'
          ],
          category: 'employment',
          priority: 'low',
          dependsOn: 'employment_type',
          showWhen: (value) => ['Nhân viên chính thức', 'Nhân viên hợp đồng'].includes(value),
          icon: '🏢'
        }
      ]
    },
    {
      id: 'credit',
      name: 'Lịch sử tín dụng',
      description: 'Kinh nghiệm sử dụng các sản phẩm tín dụng',
      icon: '📈',
      questions: [
        {
          id: 'existing_credit_cards',
          type: 'select',
          label: 'Số thẻ tín dụng hiện có',
          required: true,
          options: [
            'Chưa có thẻ nào',
            '1 thẻ',
            '2-3 thẻ',
            '4-5 thẻ',
            'Trên 5 thẻ'
          ],
          category: 'credit',
          priority: 'high',
          icon: '💳'
        },
        {
          id: 'payment_history',
          type: 'select',
          label: 'Lịch sử thanh toán',
          required: true,
          options: [
            'Luôn thanh toán đúng hạn',
            'Thỉnh thoảng trễ hạn',
            'Thường xuyên trễ hạn',
            'Chưa có lịch sử tín dụng'
          ],
          category: 'credit',
          priority: 'high',
          dependsOn: 'existing_credit_cards',
          showWhen: (value) => value !== 'Chưa có thẻ nào',
          icon: '✅'
        },
        {
          id: 'current_debt',
          type: 'select',
          label: 'Tổng dư nợ hiện tại',
          required: false,
          options: [
            'Không có nợ',
            'Dưới 10 triệu VNĐ',
            '10-50 triệu VNĐ',
            '50-100 triệu VNĐ',
            'Trên 100 triệu VNĐ'
          ],
          category: 'credit',
          priority: 'medium',
          helpText: 'Bao gồm thẻ tín dụng, vay cá nhân, vay mua nhà/xe',
          icon: '📋'
        }
      ]
    }
  ],
  smartValidation: {
    creditScoreEstimation: true,
    incomeVerification: true,
    riskAssessment: true
  }
};

// Mortgage Loan Questionnaire (Optimized)
const mortgageQuestionnaire: OptimizedQuestionForm = {
  productType: 'mortgage_loan',
  title: 'Vay Mua Nhà/Bất Động Sản',
  description: 'Thông tin chi tiết để đánh giá khả năng vay và đề xuất gói vay tối ưu',
  estimatedTime: '8-12 phút',
  categories: [
    {
      id: 'product_specific',
      name: 'Thông tin bất động sản',
      description: 'Chi tiết về bất động sản bạn muốn mua',
      icon: '🏠',
      questions: [
        {
          id: 'property_type',
          type: 'select',
          label: 'Loại bất động sản',
          required: true,
          options: [
            'Căn hộ chung cư',
            'Nhà riêng/Nhà phố',
            'Biệt thự',
            'Đất nền',
            'Shophouse',
            'Nhà xưởng/Kho'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '🏘️'
        },
        {
          id: 'property_status',
          type: 'select',
          label: 'Tình trạng bất động sản',
          required: true,
          options: [
            'Đã hoàn thành',
            'Đang xây dựng',
            'Chưa khởi công',
            'Nhà cũ cần sửa chữa'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '🚧'
        },
        {
          id: 'property_value',
          type: 'select',
          label: 'Giá trị bất động sản',
          required: true,
          options: [
            'Dưới 1 tỷ VNĐ',
            '1-2 tỷ VNĐ',
            '2-3 tỷ VNĐ',
            '3-5 tỷ VNĐ',
            '5-10 tỷ VNĐ',
            'Trên 10 tỷ VNĐ'
          ],
          category: 'product_specific',
          priority: 'high',
          helpText: 'Giá trị theo hợp đồng mua bán hoặc định giá thị trường',
          icon: '💰'
        },
        {
          id: 'down_payment_percentage',
          type: 'select',
          label: 'Tỷ lệ vốn tự có',
          required: true,
          options: [
            '15-20%',
            '20-30%',
            '30-40%',
            '40-50%',
            'Trên 50%'
          ],
          category: 'product_specific',
          priority: 'high',
          helpText: 'Số tiền bạn có thể trả trước so với giá trị BĐS',
          icon: '📊'
        },
        {
          id: 'loan_term_preference',
          type: 'select',
          label: 'Thời hạn vay mong muốn',
          required: true,
          options: [
            '5-10 năm',
            '10-15 năm',
            '15-20 năm',
            '20-25 năm',
            'Tối đa có thể'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '⏰'
        }
      ]
    },
    {
      id: 'financial',
      name: 'Tình hình tài chính',
      description: 'Thu nhập, tài sản và khả năng tài chính',
      icon: '💰',
      questions: [
        {
          id: 'primary_income',
          type: 'select',
          label: 'Thu nhập chính hàng tháng',
          required: true,
          options: [
            '20-30 triệu VNĐ',
            '30-50 triệu VNĐ',
            '50-100 triệu VNĐ',
            '100-200 triệu VNĐ',
            'Trên 200 triệu VNĐ'
          ],
          category: 'financial',
          priority: 'high',
          icon: '💵'
        },
        {
          id: 'income_sources',
          type: 'checkbox',
          label: 'Nguồn thu nhập',
          required: true,
          options: [
            'Lương chính thức',
            'Kinh doanh',
            'Cho thuê bất động sản',
            'Đầu tư chứng khoán',
            'Thu nhập từ freelance',
            'Nguồn khác'
          ],
          category: 'financial',
          priority: 'high',
          helpText: 'Chọn tất cả nguồn thu nhập của bạn',
          icon: '📈'
        },
        {
          id: 'financial_assets',
          type: 'select',
          label: 'Tài sản tài chính hiện có',
          required: false,
          options: [
            'Dưới 100 triệu VNĐ',
            '100-500 triệu VNĐ',
            '500 triệu - 1 tỷ VNĐ',
            '1-2 tỷ VNĐ',
            'Trên 2 tỷ VNĐ'
          ],
          category: 'financial',
          priority: 'medium',
          helpText: 'Tiền gửi, chứng khoán, bảo hiểm có giá trị hoàn lại',
          icon: '🏦'
        },
        {
          id: 'existing_properties',
          type: 'select',
          label: 'Bất động sản hiện có',
          required: false,
          options: [
            'Chưa có',
            '1 bất động sản',
            '2-3 bất động sản',
            'Trên 3 bất động sản'
          ],
          category: 'financial',
          priority: 'medium',
          icon: '🏡'
        }
      ]
    },
    {
      id: 'employment',
      name: 'Thông tin nghề nghiệp',
      description: 'Tình trạng công việc và thu nhập',
      icon: '💼',
      questions: [
        {
          id: 'employment_status',
          type: 'select',
          label: 'Tình trạng việc làm',
          required: true,
          options: [
            'Nhân viên chính thức',
            'Chủ doanh nghiệp',
            'Giám đốc/Quản lý cấp cao',
            'Freelancer/Tự do',
            'Nghỉ hưu có thu nhập'
          ],
          category: 'employment',
          priority: 'high',
          icon: '👔'
        },
        {
          id: 'job_stability',
          type: 'select',
          label: 'Thời gian ổn định công việc hiện tại',
          required: true,
          options: [
            'Dưới 1 năm',
            '1-2 năm',
            '2-5 năm',
            '5-10 năm',
            'Trên 10 năm'
          ],
          category: 'employment',
          priority: 'high',
          icon: '⏳'
        },
        {
          id: 'industry_type',
          type: 'select',
          label: 'Lĩnh vực công việc',
          required: false,
          options: [
            'Ngân hàng/Tài chính',
            'Công nghệ thông tin',
            'Y tế',
            'Giáo dục',
            'Bất động sản',
            'Sản xuất',
            'Dịch vụ',
            'Khác'
          ],
          category: 'employment',
          priority: 'low',
          icon: '🏭'
        }
      ]
    },
    {
      id: 'credit',
      name: 'Lịch sử tín dụng',
      description: 'Kinh nghiệm vay vốn và tín dụng',
      icon: '📈',
      questions: [
        {
          id: 'mortgage_experience',
          type: 'select',
          label: 'Kinh nghiệm vay mua nhà',
          required: true,
          options: [
            'Lần đầu vay mua nhà',
            'Đã từng vay mua nhà',
            'Hiện có khoản vay nhà',
            'Đã trả hết nợ nhà'
          ],
          category: 'credit',
          priority: 'high',
          icon: '🏠'
        },
        {
          id: 'current_debts',
          type: 'select',
          label: 'Tổng nợ hiện tại',
          required: true,
          options: [
            'Không có nợ',
            'Dưới 100 triệu VNĐ',
            '100-500 triệu VNĐ',
            '500 triệu - 1 tỷ VNĐ',
            'Trên 1 tỷ VNĐ'
          ],
          category: 'credit',
          priority: 'high',
          helpText: 'Bao gồm thẻ tín dụng, vay cá nhân, vay xe, vay nhà khác',
          icon: '📋'
        },
        {
          id: 'credit_score_self_assessment',
          type: 'select',
          label: 'Tự đánh giá mức độ tín dụng',
          required: false,
          options: [
            'Rất tốt - không nợ xấu',
            'Tốt - trả nợ đúng hạn',
            'Trung bình - có trễ hạn nhẹ',
            'Cần cải thiện',
            'Không rõ'
          ],
          category: 'credit',
          priority: 'medium',
          icon: '⭐'
        }
      ]
    }
  ],
  smartValidation: {
    creditScoreEstimation: true,
    incomeVerification: true,
    riskAssessment: true
  }
};

// Car Loan Questionnaire (New)
const carLoanQuestionnaire: OptimizedQuestionForm = {
  productType: 'car_loan',
  title: 'Vay Mua Xe',
  description: 'Thông tin để tìm gói vay xe phù hợp với nhu cầu của bạn',
  estimatedTime: '4-6 phút',
  categories: [
    {
      id: 'product_specific',
      name: 'Thông tin xe muốn mua',
      description: 'Chi tiết về chiếc xe bạn quan tâm',
      icon: '🚗',
      questions: [
        {
          id: 'car_type',
          type: 'select',
          label: 'Loại xe',
          required: true,
          options: [
            'Xe du lịch (sedan)',
            'Xe SUV/CUV',
            'Xe pickup/bán tải',
            'Xe hatchback',
            'Xe thể thao',
            'Xe điện'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '🚙'
        },
        {
          id: 'car_condition',
          type: 'select',
          label: 'Tình trạng xe',
          required: true,
          options: [
            'Xe mới 100%',
            'Xe đã qua sử dụng (dưới 5 năm)',
            'Xe đã qua sử dụng (5-10 năm)',
            'Xe cũ (trên 10 năm)'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '🔧'
        },
        {
          id: 'car_value',
          type: 'select',
          label: 'Giá trị xe',
          required: true,
          options: [
            'Dưới 500 triệu VNĐ',
            '500 triệu - 1 tỷ VNĐ',
            '1-1.5 tỷ VNĐ',
            '1.5-2 tỷ VNĐ',
            'Trên 2 tỷ VNĐ'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '💰'
        }
      ]
    }
  ],
  smartValidation: {
    creditScoreEstimation: true,
    incomeVerification: false,
    riskAssessment: true
  }
};

// Business Loan Questionnaire (New)
const businessLoanQuestionnaire: OptimizedQuestionForm = {
  productType: 'business_loan',
  title: 'Vay Kinh Doanh',
  description: 'Thông tin để đánh giá và đề xuất gói vay kinh doanh phù hợp',
  estimatedTime: '6-8 phút',
  categories: [
    {
      id: 'product_specific',
      name: 'Thông tin kinh doanh',
      description: 'Chi tiết về doanh nghiệp và nhu cầu vay',
      icon: '🏢',
      questions: [
        {
          id: 'business_type',
          type: 'select',
          label: 'Loại hình doanh nghiệp',
          required: true,
          options: [
            'Doanh nghiệp tư nhân',
            'Công ty TNHH',
            'Công ty cổ phần',
            'Hộ kinh doanh cá thể'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '🏭'
        }
      ]
    }
  ],
  smartValidation: {
    creditScoreEstimation: true,
    incomeVerification: true,
    riskAssessment: true
  }
};

// Education Loan Questionnaire (New)
const educationLoanQuestionnaire: OptimizedQuestionForm = {
  productType: 'education_loan',
  title: 'Vay Học Tập',
  description: 'Thông tin để đánh giá nhu cầu vay học phí và chi phí học tập',
  estimatedTime: '4-6 phút',
  categories: [
    {
      id: 'product_specific',
      name: 'Thông tin học tập',
      description: 'Chi tiết về khóa học và nhu cầu tài chính',
      icon: '🎓',
      questions: [
        {
          id: 'education_level',
          type: 'select',
          label: 'Bậc học',
          required: true,
          options: [
            'Đại học',
            'Thạc sĩ',
            'Tiến sĩ',
            'Khóa học nghề nghiệp'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '📚'
        }
      ]
    }
  ],
  smartValidation: {
    creditScoreEstimation: false,
    incomeVerification: false,
    riskAssessment: true
  }
};

// Credit Consumer Loan Questionnaire (TÍN CHẤP – VAY TIÊU DÙNG)
const creditConsumerLoanQuestionnaire: OptimizedQuestionForm = {
  productType: 'credit_loan',
  title: 'Vay Tín Chấp - Tiêu Dùng',
  description: 'Hoàn thành thông tin để nhận đề xuất vay tín chấp phù hợp với nhu cầu của bạn',
  estimatedTime: '8-12 phút',
  categories: [
    {
      id: 'basic',
      name: 'Thông tin cơ bản',
      description: 'Thông tin cá nhân và liên hệ',
      icon: '👤',
      questions: [
        {
          id: 'full_name',
          type: 'text',
          label: 'Họ và tên',
          placeholder: 'Nguyễn Văn A',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^[a-zA-ZÀ-ỹ\\s]{2,50}$',
            message: 'Họ tên phải từ 2-50 ký tự, chỉ chứa chữ cái'
          },
          icon: '👤'
        },
        {
          id: 'phone_number',
          type: 'phone',
          label: 'Số điện thoại',
          placeholder: '0901234567',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^(0|\\+84)[3-9][0-9]{8}$',
            message: 'Số điện thoại không hợp lệ'
          },
          icon: '📱'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'example@email.com',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
            message: 'Email không hợp lệ'
          },
          icon: '📧'
        },
        {
          id: 'id_number',
          type: 'id_number',
          label: 'Số CMND/CCCD',
          placeholder: '123456789012',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            pattern: '^[0-9]{9,12}$',
            message: 'CMND/CCCD phải có 9-12 chữ số'
          },
          icon: '🆔'
        },
        {
          id: 'date_of_birth',
          type: 'date',
          label: 'Ngày sinh',
          required: true,
          category: 'basic',
          priority: 'high',
          validation: {
            min: 18,
            max: 65,
            message: 'Tuổi phải từ 18-65'
          },
          icon: '📅'
        },
        {
          id: 'gender',
          type: 'radio',
          label: 'Giới tính',
          required: true,
          options: ['Nam', 'Nữ', 'Khác'],
          category: 'basic',
          priority: 'high',
          icon: '👥'
        },
        {
          id: 'marital_status',
          type: 'select',
          label: 'Tình trạng hôn nhân',
          required: true,
          options: [
            'Độc thân',
            'Đã kết hôn',
            'Ly hôn',
            'Góa',
            'Sống chung không đăng ký'
          ],
          category: 'basic',
          priority: 'high',
          icon: '💑'
        },
        {
          id: 'education_level',
          type: 'select',
          label: 'Trình độ học vấn',
          required: true,
          options: [
            'Trung học phổ thông',
            'Trung cấp/Cao đẳng',
            'Đại học',
            'Thạc sĩ',
            'Tiến sĩ'
          ],
          category: 'basic',
          priority: 'medium',
          icon: '🎓'
        }
      ]
    },
    {
      id: 'financial',
      name: 'Thông tin tài chính',
      description: 'Thu nhập, chi phí và tình hình tài chính',
      icon: '💰',
      questions: [
        {
          id: 'loan_amount',
          type: 'slider',
          label: 'Số tiền vay mong muốn',
          required: true,
          category: 'financial',
          priority: 'high',
          sliderConfig: {
            min: 10000000,
            max: 2000000000,
            step: 5000000,
            marks: [
              { value: 10000000, label: '10 triệu' },
              { value: 100000000, label: '100 triệu' },
              { value: 500000000, label: '500 triệu' },
              { value: 1000000000, label: '1 tỷ' },
              { value: 2000000000, label: '2 tỷ' }
            ]
          },
          helpText: 'Kéo thanh trượt để chọn số tiền vay phù hợp',
          icon: '💵'
        },
        {
          id: 'loan_term',
          type: 'select',
          label: 'Thời hạn vay',
          required: true,
          options: [
            '3 tháng',
            '6 tháng',
            '12 tháng',
            '18 tháng',
            '24 tháng',
            '36 tháng',
            '48 tháng',
            '60 tháng'
          ],
          category: 'financial',
          priority: 'high',
          icon: '📅'
        },
        {
          id: 'monthly_income',
          type: 'currency',
          label: 'Thu nhập hàng tháng',
          placeholder: '20,000,000',
          required: true,
          category: 'financial',
          priority: 'high',
          validation: {
            min: 5000000,
            message: 'Thu nhập tối thiểu 5 triệu VNĐ'
          },
          helpText: 'Bao gồm tất cả nguồn thu nhập ổn định',
          icon: '💰'
        },
        {
          id: 'income_stability',
          type: 'select',
          label: 'Tính ổn định thu nhập',
          required: true,
          options: [
            'Rất ổn định (lương cố định từ 12 tháng trở lên)',
            'Ổn định (lương cố định từ 6-12 tháng)',
            'Tương đối ổn định (có biến động nhẹ)',
            'Không ổn định (thu nhập theo dự án/mùa vụ)',
            'Mới bắt đầu có thu nhập'
          ],
          category: 'financial',
          priority: 'high',
          icon: '📊'
        },
        {
          id: 'monthly_expenses',
          type: 'currency',
          label: 'Chi phí sinh hoạt hàng tháng',
          placeholder: '10,000,000',
          required: true,
          category: 'financial',
          priority: 'medium',
          validation: {
            max: 50000000,
            message: 'Chi phí quá cao so với thu nhập'
          },
          helpText: 'Bao gồm ăn uống, nhà ở, di chuyển, học phí, y tế',
          icon: '🏠'
        },
        {
          id: 'savings_amount',
          type: 'currency',
          label: 'Số tiền tiết kiệm hiện có',
          placeholder: '50,000,000',
          required: false,
          category: 'financial',
          priority: 'medium',
          helpText: 'Tiền gửi ngân hàng, tiền mặt, chứng khoán',
          icon: '🏦'
        }
      ]
    },
    {
      id: 'employment',
      name: 'Thông tin nghề nghiệp',
      description: 'Chi tiết về công việc và thu nhập',
      icon: '💼',
      questions: [
        {
          id: 'employment_type',
          type: 'select',
          label: 'Loại hình việc làm',
          required: true,
          options: [
            'Nhân viên chính thức (có hợp đồng lao động)',
            'Nhân viên hợp đồng (có thời hạn)',
            'Công chức/Viên chức',
            'Chủ doanh nghiệp/Giám đốc',
            'Kinh doanh tự do/Freelancer',
            'Nghỉ hưu có lương hưu',
            'Sinh viên có thu nhập',
            'Thất nghiệp/Không có việc làm'
          ],
          category: 'employment',
          priority: 'high',
          icon: '👔'
        },
        {
          id: 'company_name',
          type: 'text',
          label: 'Tên công ty/Cơ quan',
          placeholder: 'Công ty TNHH ABC',
          required: true,
          category: 'employment',
          priority: 'high',
          dependsOn: 'employment_type',
          showWhen: (value) => !['Kinh doanh tự do/Freelancer', 'Thất nghiệp/Không có việc làm'].includes(value),
          validation: {
            minLength: 2,
            maxLength: 100,
            message: 'Tên công ty phải từ 2-100 ký tự'
          },
          icon: '🏢'
        },
        {
          id: 'job_position',
          type: 'text',
          label: 'Chức vụ/Vị trí công việc',
          placeholder: 'Nhân viên kế toán',
          required: true,
          category: 'employment',
          priority: 'high',
          dependsOn: 'employment_type',
          showWhen: (value) => !['Kinh doanh tự do/Freelancer', 'Thất nghiệp/Không có việc làm'].includes(value),
          validation: {
            minLength: 2,
            maxLength: 50
          },
          icon: '👨‍💼'
        },
        {
          id: 'work_experience_current_job',
          type: 'select',
          label: 'Thời gian làm việc tại công ty hiện tại',
          required: true,
          options: [
            'Dưới 3 tháng',
            '3-6 tháng',
            '6-12 tháng',
            '1-2 năm',
            '2-5 năm',
            '5-10 năm',
            'Trên 10 năm'
          ],
          category: 'employment',
          priority: 'high',
          dependsOn: 'employment_type',
          showWhen: (value) => !['Kinh doanh tự do/Freelancer', 'Thất nghiệp/Không có việc làm'].includes(value),
          icon: '⏳'
        },
        {
          id: 'total_work_experience',
          type: 'select',
          label: 'Tổng số năm kinh nghiệm làm việc',
          required: true,
          options: [
            'Dưới 1 năm',
            '1-3 năm',
            '3-5 năm',
            '5-10 năm',
            '10-15 năm',
            'Trên 15 năm'
          ],
          category: 'employment',
          priority: 'medium',
          icon: '📈'
        },
        {
          id: 'industry',
          type: 'select',
          label: 'Lĩnh vực hoạt động',
          required: false,
          options: [
            'Ngân hàng/Tài chính/Bảo hiểm',
            'Công nghệ thông tin',
            'Viễn thông',
            'Y tế/Dược phẩm',
            'Giáo dục/Đào tạo',
            'Bất động sản',
            'Xây dựng',
            'Sản xuất/Chế tạo',
            'Thương mại/Bán lẻ',
            'Du lịch/Nhà hàng/Khách sạn',
            'Vận tải/Logistics',
            'Nông nghiệp/Thủy sản',
            'Dầu khí/Năng lượng',
            'Chính phủ/Cơ quan nhà nước',
            'Tổ chức phi lợi nhuận',
            'Khác'
          ],
          category: 'employment',
          priority: 'low',
          icon: '🏭'
        }
      ]
    },
    {
      id: 'family',
      name: 'Thông tin gia đình',
      description: 'Thông tin về gia đình và người phụ thuộc',
      icon: '👨‍👩‍👧‍👦',
      questions: [
        {
          id: 'spouse_info',
          type: 'radio',
          label: 'Tình trạng vợ/chồng',
          required: true,
          options: [
            'Không có vợ/chồng',
            'Có vợ/chồng nhưng không có thu nhập',
            'Có vợ/chồng có thu nhập ổn định',
            'Có vợ/chồng có thu nhập không ổn định'
          ],
          category: 'family',
          priority: 'high',
          dependsOn: 'marital_status',
          showWhen: (value) => ['Đã kết hôn', 'Sống chung không đăng ký'].includes(value),
          icon: '💑'
        },
        {
          id: 'spouse_monthly_income',
          type: 'currency',
          label: 'Thu nhập hàng tháng của vợ/chồng',
          placeholder: '15,000,000',
          required: false,
          category: 'family',
          priority: 'medium',
          dependsOn: 'spouse_info',
          showWhen: (value) => ['Có vợ/chồng có thu nhập ổn định', 'Có vợ/chồng có thu nhập không ổn định'].includes(value),
          helpText: 'Thu nhập ròng sau thuế',
          icon: '💰'
        },
        {
          id: 'number_of_dependents',
          type: 'select',
          label: 'Số người phụ thuộc',
          required: true,
          options: [
            '0 người',
            '1 người',
            '2 người',
            '3 người',
            '4 người',
            'Trên 4 người'
          ],
          category: 'family',
          priority: 'medium',
          helpText: 'Bao gồm con nhỏ, cha mẹ già, người thân cần hỗ trợ tài chính',
          icon: '👶'
        },
        {
          id: 'housing_situation',
          type: 'select',
          label: 'Tình trạng nhà ở',
          required: true,
          options: [
            'Sở hữu nhà riêng (không có nợ)',
            'Sở hữu nhà riêng (đang trả nợ ngân hàng)',
            'Thuê nhà/căn hộ',
            'Ở cùng gia đình/bố mẹ',
            'Ở nhà công ty',
            'Khác'
          ],
          category: 'family',
          priority: 'medium',
          icon: '🏠'
        },
        {
          id: 'monthly_housing_cost',
          type: 'currency',
          label: 'Chi phí nhà ở hàng tháng',
          placeholder: '5,000,000',
          required: false,
          category: 'family',
          priority: 'low',
          dependsOn: 'housing_situation',
          showWhen: (value) => ['Sở hữu nhà riêng (đang trả nợ ngân hàng)', 'Thuê nhà/căn hộ'].includes(value),
          helpText: 'Tiền thuê nhà hoặc khoản vay mua nhà hàng tháng',
          icon: '💳'
        }
      ]
    },
    {
      id: 'product_specific',
      name: 'Mục đích vay',
      description: 'Chi tiết về mục đích sử dụng khoản vay',
      icon: '🎯',
      questions: [
        {
          id: 'loan_purpose',
          type: 'select',
          label: 'Mục đích vay chính',
          required: true,
          options: [
            'Tiêu dùng cá nhân/gia đình',
            'Mua sắm hàng hóa cao cấp',
            'Du lịch/Nghỉ dưỡng',
            'Chữa bệnh/Y tế',
            'Học tập/Đào tạo',
            'Đám cưới/Sự kiện gia đình',
            'Sửa chữa/Cải tạo nhà cửa',
            'Trả nợ/Tái cấu trúc nợ',
            'Kinh doanh nhỏ lẻ',
            'Đầu tư/Sinh lời',
            'Khẩn cấp/Bất khả kháng',
            'Khác'
          ],
          category: 'product_specific',
          priority: 'high',
          icon: '🎯'
        },
        {
          id: 'loan_purpose_detail',
          type: 'textarea',
          label: 'Mô tả chi tiết mục đích vay',
          placeholder: 'Vui lòng mô tả cụ thể mục đích sử dụng số tiền vay...',
          required: true,
          category: 'product_specific',
          priority: 'high',
          validation: {
            minLength: 10,
            maxLength: 500,
            message: 'Mô tả phải từ 10-500 ký tự'
          },
          helpText: 'Mô tả càng chi tiết sẽ giúp ngân hàng đánh giá và xử lý nhanh hơn',
          icon: '📝'
        },
        {
          id: 'preferred_payment_method',
          type: 'select',
          label: 'Phương thức trả nợ ưu tiên',
          required: true,
          options: [
            'Trả gốc và lãi đều hàng tháng',
            'Trả lãi hàng tháng, gốc cuối kỳ',
            'Trả nợ theo quý',
            'Trả nợ linh hoạt theo thu nhập',
            'Khác'
          ],
          category: 'product_specific',
          priority: 'medium',
          icon: '💳'
        },
        {
          id: 'urgency_level',
          type: 'select',
          label: 'Mức độ cần tiền',
          required: true,
          options: [
            'Rất gấp (trong 1-2 ngày)',
            'Gấp (trong 1 tuần)',
            'Bình thường (trong 2-3 tuần)',
            'Không gấp (trong 1 tháng)',
            'Lên kế hoạch trước'
          ],
          category: 'product_specific',
          priority: 'medium',
          helpText: 'Giúp ngân hàng ưu tiên xử lý hồ sơ phù hợp',
          icon: '⚡'
        }
      ]
    },
    {
      id: 'credit',
      name: 'Lịch sử tín dụng',
      description: 'Thông tin về các khoản vay và thẻ tín dụng hiện có',
      icon: '📈',
      questions: [
        {
          id: 'existing_loans',
          type: 'select',
          label: 'Khoản vay hiện có',
          required: true,
          options: [
            'Không có khoản vay nào',
            'Có 1 khoản vay',
            'Có 2-3 khoản vay',
            'Có trên 3 khoản vay'
          ],
          category: 'credit',
          priority: 'high',
          icon: '💳'
        },
        {
          id: 'total_monthly_debt_payment',
          type: 'currency',
          label: 'Tổng số tiền trả nợ hàng tháng',
          placeholder: '5,000,000',
          required: false,
          category: 'credit',
          priority: 'high',
          dependsOn: 'existing_loans',
          showWhen: (value) => value !== 'Không có khoản vay nào',
          helpText: 'Bao gồm tất cả các khoản vay: nhà, xe, thẻ tín dụng, vay cá nhân',
          icon: '💰'
        },
        {
          id: 'credit_cards_count',
          type: 'select',
          label: 'Số thẻ tín dụng hiện có',
          required: true,
          options: [
            'Không có thẻ tín dụng',
            '1 thẻ',
            '2-3 thẻ',
            '4-5 thẻ',
            'Trên 5 thẻ'
          ],
          category: 'credit',
          priority: 'high',
          icon: '💳'
        },
        {
          id: 'credit_card_usage',
          type: 'select',
          label: 'Mức độ sử dụng thẻ tín dụng',
          required: false,
          options: [
            'Sử dụng ít (dưới 30% hạn mức)',
            'Sử dụng vừa phải (30-70% hạn mức)',
            'Sử dụng nhiều (trên 70% hạn mức)',
            'Luôn sử dụng hết hạn mức',
            'Thường xuyên thanh toán thiếu'
          ],
          category: 'credit',
          priority: 'medium',
          dependsOn: 'credit_cards_count',
          showWhen: (value) => value !== 'Không có thẻ tín dụng',
          icon: '📊'
        },
        {
          id: 'payment_history',
          type: 'select',
          label: 'Lịch sử thanh toán',
          required: true,
          options: [
            'Luôn thanh toán đúng hạn',
            'Thỉnh thoảng trễ hạn (1-2 lần/năm)',
            'Thường xuyên trễ hạn (3-5 lần/năm)',
            'Rất thường xuyên trễ hạn (trên 5 lần/năm)',
            'Chưa có lịch sử tín dụng'
          ],
          category: 'credit',
          priority: 'high',
          helpText: 'Bao gồm tất cả các khoản vay và thẻ tín dụng',
          icon: '✅'
        },
        {
          id: 'blacklist_status',
          type: 'radio',
          label: 'Bạn có bị CIC ghi nợ xấu không?',
          required: true,
          options: [
            'Không, tôi chưa bao giờ bị ghi nợ xấu',
            'Có, nhưng đã thanh toán xong và được xóa',
            'Có, đang trong danh sách nợ xấu',
            'Không biết rõ tình trạng của mình'
          ],
          category: 'credit',
          priority: 'high',
          helpText: 'Thông tin này giúp ngân hàng đánh giá chính xác hồ sơ',
          icon: '⚠️'
        }
      ]
    },
    {
      id: 'additional',
      name: 'Thông tin bổ sung',
      description: 'Các thông tin khác giúp đánh giá hồ sơ tốt hơn',
      icon: '📋',
      questions: [
        {
          id: 'preferred_bank',
          type: 'select',
          label: 'Ngân hàng ưu tiên',
          required: false,
          options: [
            'Không có ưu tiên đặc biệt',
            'Vietcombank',
            'Techcombank',
            'BIDV',
            'VietinBank',
            'Agribank',
            'ACB',
            'Sacombank',
            'VPBank',
            'TPBank',
            'HDBank',
            'Khác'
          ],
          category: 'additional',
          priority: 'low',
          icon: '🏦'
        },
        {
          id: 'relationship_with_bank',
          type: 'select',
          label: 'Mối quan hệ với ngân hàng ưu tiên',
          required: false,
          options: [
            'Khách hàng mới',
            'Đã có tài khoản tiết kiệm',
            'Đã có tài khoản lương',
            'Đã từng vay vốn',
            'Khách hàng VIP/Ưu tiên'
          ],
          category: 'additional',
          priority: 'low',
          dependsOn: 'preferred_bank',
          showWhen: (value) => value !== 'Không có ưu tiên đặc biệt',
          icon: '🤝'
        },
        {
          id: 'contact_preference',
          type: 'checkbox',
          label: 'Thời gian thuận tiện để liên hệ',
          required: false,
          options: [
            'Sáng (8:00-12:00)',
            'Chiều (12:00-17:00)',
            'Tối (17:00-20:00)',
            'Cuối tuần',
            'Chỉ nhắn tin SMS/Email'
          ],
          category: 'additional',
          priority: 'low',
          helpText: 'Giúp tư vấn viên liên hệ đúng thời điểm bạn rảnh',
          icon: '📞'
        },
        {
          id: 'additional_notes',
          type: 'textarea',
          label: 'Ghi chú thêm',
          placeholder: 'Các thông tin bổ sung khác mà bạn muốn chia sẻ...',
          required: false,
          category: 'additional',
          priority: 'low',
          validation: {
            maxLength: 1000,
            message: 'Ghi chú không được quá 1000 ký tự'
          },
          icon: '📝'
        }
      ]
    }
  ],
  smartValidation: {
    creditScoreEstimation: true,
    incomeVerification: true,
    riskAssessment: true
  }
};

export const optimizedQuestionnaires: Record<LoanProductType, OptimizedQuestionForm> = {
  credit_loan: creditConsumerLoanQuestionnaire, // Updated to use the new comprehensive questionnaire
  mortgage_loan: mortgageQuestionnaire,
  car_loan: carLoanQuestionnaire,
  business_loan: businessLoanQuestionnaire,
  education_loan: educationLoanQuestionnaire
};

// Utility functions for smart questionnaire handling
export const getQuestionnaireForProduct = (productType: LoanProductType): OptimizedQuestionForm => {
  return optimizedQuestionnaires[productType];
};

export const getHighPriorityQuestions = (questionnaire: OptimizedQuestionForm): OptimizedQuestion[] => {
  return questionnaire.categories
    .flatMap(category => category.questions)
    .filter(question => question.priority === 'high');
};

export const getConditionalQuestions = (
  questionnaire: OptimizedQuestionForm,
  formData: Record<string, any>
): OptimizedQuestion[] => {
  return questionnaire.categories
    .flatMap(category => category.questions)
    .filter(question => {
      if (!question.dependsOn || !question.showWhen) return true;
      const dependentValue = formData[question.dependsOn];
      return question.showWhen(dependentValue);
    });
};

export const validateQuestionResponse = (
  question: OptimizedQuestion,
  value: any
): { isValid: boolean; message?: string } => {
  if (question.required && (!value || value === '')) {
    return { isValid: false, message: `${question.label} là bắt buộc` };
  }

  if (question.validation && value) {
    const { min, max, pattern, message } = question.validation;
    
    if (question.type === 'number') {
      const numValue = Number(value);
      if (min && numValue < min) {
        return { isValid: false, message: message || `Giá trị tối thiểu là ${min}` };
      }
      if (max && numValue > max) {
        return { isValid: false, message: message || `Giá trị tối đa là ${max}` };
      }
    }

    if (pattern && typeof value === 'string') {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        return { isValid: false, message: message || 'Định dạng không hợp lệ' };
      }
    }
  }

  return { isValid: true };
};