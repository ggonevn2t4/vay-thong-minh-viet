
import { LoanProduct, CustomQuestionForm } from '@/types/loan-application-flow';

export const loanProducts: LoanProduct[] = [
  {
    id: 'credit_loan',
    name: 'Vay tín dụng',
    description: 'Vay vốn dựa trên uy tín và khả năng trả nợ của bạn',
    icon: '💳',
    benefits: [
      'Không cần tài sản đảm bảo',
      'Thủ tục đơn giản, nhanh chóng',
      'Lãi suất cạnh tranh',
      'Thời gian vay linh hoạt'
    ],
    requirements: [
      'Thu nhập ổn định từ 8 triệu/tháng',
      'Lịch sử tín dụng tốt',
      'Độ tuổi từ 22-60',
      'Có công việc ổn định'
    ]
  },
  {
    id: 'mortgage_loan',
    name: 'Vay thế chấp',
    description: 'Vay vốn với tài sản bất động sản làm tài sản đảm bảo',
    icon: '🏠',
    benefits: [
      'Hạn mức vay cao',
      'Lãi suất ưu đãi',
      'Thời gian vay dài đến 25 năm',
      'Nhiều mục đích sử dụng'
    ],
    requirements: [
      'Có tài sản bất động sản hợp pháp',
      'Thu nhập ổn định',
      'Giấy tờ pháp lý đầy đủ',
      'Tài sản có giá trị thẩm định'
    ]
  }
];

export const customQuestionForms: Record<string, CustomQuestionForm> = {
  credit_loan: {
    productType: 'credit_loan',
    questions: [
      {
        id: 'employment_status',
        type: 'select',
        label: 'Tình trạng việc làm',
        required: true,
        options: ['Nhân viên công ty', 'Công chức', 'Kinh doanh tự do', 'Freelancer']
      },
      {
        id: 'company_name',
        type: 'text',
        label: 'Tên công ty/nơi làm việc',
        placeholder: 'Nhập tên công ty',
        required: true
      },
      {
        id: 'work_experience',
        type: 'number',
        label: 'Số năm kinh nghiệm làm việc',
        required: true,
        validation: { min: 0, max: 50 }
      },
      {
        id: 'monthly_income',
        type: 'number',
        label: 'Thu nhập hàng tháng (VNĐ)',
        placeholder: 'Ví dụ: 15000000',
        required: true,
        validation: { min: 1000000 }
      },
      {
        id: 'current_debts',
        type: 'number',
        label: 'Tổng nợ hiện tại (VNĐ)',
        placeholder: 'Ví dụ: 50000000',
        required: false,
        validation: { min: 0 }
      },
      {
        id: 'loan_purpose_detail',
        type: 'textarea',
        label: 'Mô tả chi tiết mục đích vay',
        placeholder: 'Ví dụ: Vay để mở rộng kinh doanh, mua xe ô tô...',
        required: true
      }
    ]
  },
  mortgage_loan: {
    productType: 'mortgage_loan',
    questions: [
      {
        id: 'property_type',
        type: 'select',
        label: 'Loại tài sản thế chấp',
        required: true,
        options: ['Nhà riêng', 'Căn hộ chung cư', 'Đất nền', 'Nhà mặt phố', 'Biệt thự']
      },
      {
        id: 'property_address',
        type: 'text',
        label: 'Địa chỉ tài sản',
        placeholder: 'Nhập địa chỉ đầy đủ của tài sản',
        required: true
      },
      {
        id: 'property_value',
        type: 'number',
        label: 'Giá trị tài sản ước tính (VNĐ)',
        placeholder: 'Ví dụ: 3000000000',
        required: true,
        validation: { min: 500000000 }
      },
      {
        id: 'property_documents',
        type: 'select',
        label: 'Tình trạng giấy tờ',
        required: true,
        options: ['Sổ đỏ/sổ hồng', 'Hợp đồng mua bán', 'Giấy chứng nhận quyền sử dụng đất']
      },
      {
        id: 'loan_purpose',
        type: 'select',
        label: 'Mục đích vay',
        required: true,
        options: ['Mua nhà', 'Sửa chữa nhà', 'Kinh doanh', 'Đầu tư', 'Nhu cầu cá nhân khác']
      },
      {
        id: 'repayment_capacity',
        type: 'number',
        label: 'Khả năng trả nợ hàng tháng (VNĐ)',
        placeholder: 'Ví dụ: 20000000',
        required: true,
        validation: { min: 1000000 }
      }
    ]
  }
};
