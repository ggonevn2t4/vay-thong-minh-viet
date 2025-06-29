
import { LoanProduct, CustomQuestionForm, LoanProductType } from '@/types/loan-application-flow';

export const loanProducts: LoanProduct[] = [
  {
    id: 'credit_loan',
    name: 'Vay tín dụng',
    description: 'Vay không tài sản đảm bảo với lãi suất ưu đãi',
    icon: '💳',
    benefits: [
      'Không cần tài sản đảm bảo',
      'Thủ tục đơn giản, nhanh chóng',
      'Lãi suất cạnh tranh',
      'Thời gian vay linh hoạt'
    ],
    requirements: [
      'Có thu nhập ổn định',
      'Tuổi từ 18-65',
      'Có giấy tờ tùy thân hợp lệ',
      'Lịch sử tín dụng tốt'
    ]
  },
  {
    id: 'mortgage_loan',
    name: 'Vay mua nhà',
    description: 'Vay mua nhà với lãi suất ưu đãi, thời hạn dài',
    icon: '🏠',
    benefits: [
      'Lãi suất ưu đãi',
      'Thời hạn vay lên đến 25 năm',
      'Vay đến 85% giá trị nhà',
      'Hỗ trợ làm thủ tục pháp lý'
    ],
    requirements: [
      'Có thu nhập ổn định',
      'Đóng trước tối thiểu 15%',
      'Có hồ sơ pháp lý đầy đủ',
      'Tuổi từ 18-60'
    ]
  }
];

export const customQuestionForms: Record<LoanProductType, CustomQuestionForm> = {
  credit_loan: {
    productType: 'credit_loan',
    questions: [
      // Thông tin mong muốn về thẻ tín dụng
      {
        id: 'han_muc_the_mong_muon',
        type: 'number',
        label: 'Hạn mức thẻ mong muốn (triệu VNĐ)',
        placeholder: 'Nhập hạn mức mong muốn',
        required: true,
        validation: {
          min: 1,
          max: 500
        }
      },
      {
        id: 'loai_the_mong_muon',
        type: 'select',
        label: 'Loại thẻ mong muốn phát hành',
        required: true,
        options: ['Visa', 'JCB', 'Mastercard', 'Khác']
      },

      // Thông tin cơ bản
      {
        id: 'ho_ten',
        type: 'text',
        label: 'Họ và tên',
        placeholder: 'Nhập họ và tên đầy đủ',
        required: true
      },
      {
        id: 'so_dien_thoai',
        type: 'text',
        label: 'Số điện thoại',
        placeholder: 'Nhập số điện thoại',
        required: true
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email',
        placeholder: 'Nhập địa chỉ email',
        required: true
      },
      {
        id: 'cmnd_cccd',
        type: 'text',
        label: 'Số CMND/CCCD',
        placeholder: 'Nhập số CMND/CCCD',
        required: true
      },
      {
        id: 'ngay_sinh',
        type: 'text',
        label: 'Ngày sinh',
        placeholder: 'dd/mm/yyyy',
        required: true
      },
      {
        id: 'gioi_tinh',
        type: 'select',
        label: 'Giới tính',
        required: true,
        options: ['Nam', 'Nữ']
      },
      {
        id: 'tinh_trang_hon_nhan',
        type: 'select',
        label: 'Tình trạng hôn nhân',
        required: true,
        options: ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa']
      },
      {
        id: 'dia_chi_thuong_tru',
        type: 'textarea',
        label: 'Địa chỉ thường trú',
        placeholder: 'Nhập địa chỉ thường trú',
        required: true
      },
      {
        id: 'dia_chi_tam_tru',
        type: 'textarea',
        label: 'Địa chỉ tạm trú',
        placeholder: 'Nhập địa chỉ tạm trú (nếu khác với thường trú)',
        required: false
      },

      // Thông tin nghề nghiệp
      {
        id: 'nghe_nghiep',
        type: 'select',
        label: 'Nghề nghiệp',
        required: true,
        options: [
          'Nhân viên văn phòng',
          'Công nhân',
          'Kinh doanh tự do',
          'Nông nghiệp',
          'Học sinh/Sinh viên',
          'Nghỉ hưu',
          'Khác'
        ]
      },
      {
        id: 'ten_cong_ty',
        type: 'text',
        label: 'Tên công ty/Nơi làm việc',
        placeholder: 'Nhập tên công ty hoặc nơi làm việc',
        required: false
      },
      {
        id: 'dia_chi_cong_ty',
        type: 'textarea',
        label: 'Địa chỉ công ty',
        placeholder: 'Nhập địa chỉ công ty',
        required: false
      },
      {
        id: 'thoi_gian_lam_viec',
        type: 'select',
        label: 'Thời gian làm việc tại công ty hiện tại',
        required: false,
        options: [
          'Dưới 6 tháng',
          '6 tháng - 1 năm',
          '1 - 2 năm',
          '2 - 5 năm',
          'Trên 5 năm'
        ]
      },

      // Thông tin tài chính chi tiết
      {
        id: 'thu_nhap_luong',
        type: 'number',
        label: 'Thu nhập từ lương (VNĐ)',
        placeholder: 'Nhập thu nhập từ lương',
        required: true,
        validation: {
          min: 0,
          max: 1000000000
        }
      },
      {
        id: 'thu_nhap_kinh_doanh',
        type: 'number',
        label: 'Thu nhập từ kinh doanh (VNĐ)',
        placeholder: 'Nhập thu nhập từ kinh doanh',
        required: false,
        validation: {
          min: 0,
          max: 1000000000
        }
      },
      {
        id: 'thu_nhap_cho_thue',
        type: 'number',
        label: 'Thu nhập từ cho thuê (VNĐ)',
        placeholder: 'Nhập thu nhập từ cho thuê',
        required: false,
        validation: {
          min: 0,
          max: 1000000000
        }
      },
      {
        id: 'thu_nhap_khac',
        type: 'number',
        label: 'Thu nhập khác (VNĐ)',
        placeholder: 'Nhập thu nhập từ nguồn khác',
        required: false,
        validation: {
          min: 0,
          max: 1000000000
        }
      },
      {
        id: 'chi_phi_sinh_hoat',
        type: 'number',
        label: 'Chi phí sinh hoạt hàng tháng (VNĐ)',
        placeholder: 'Nhập chi phí sinh hoạt hàng tháng',
        required: false,
        validation: {
          min: 0,
          max: 100000000
        }
      },

      // Thông tin tín dụng
      {
        id: 'du_no_hien_tai',
        type: 'number',
        label: 'Dư nợ hiện tại (VNĐ)',
        placeholder: 'Nhập tổng dư nợ hiện tại',
        required: false,
        validation: {
          min: 0,
          max: 10000000000
        }
      },
      {
        id: 'du_no_ca_nhan_ngan_hang',
        type: 'number',
        label: 'Dư nợ vay cá nhân tại các ngân hàng/Công ty tài chính (VNĐ)',
        placeholder: 'Nhập dư nợ vay cá nhân',
        required: false,
        validation: {
          min: 0,
          max: 10000000000
        }
      },
      {
        id: 'lich_su_tin_dung',
        type: 'select',
        label: 'Lịch sử tín dụng',
        required: false,
        options: [
          'Tốt - Không có nợ xấu',
          'Bình thường - Có trễ hạn nhẹ',
          'Không tốt - Có nợ xấu',
          'Chưa có lịch sử tín dụng'
        ]
      },
      {
        id: 'so_the_tin_dung',
        type: 'number',
        label: 'Số lượng thẻ tín dụng đang sử dụng',
        placeholder: 'Nhập số lượng thẻ tín dụng',
        required: false,
        validation: {
          min: 0,
          max: 20
        }
      },
      {
        id: 'han_muc_the_tin_dung',
        type: 'number',
        label: 'Tổng hạn mức thẻ tín dụng (VNĐ)',
        placeholder: 'Nhập tổng hạn mức thẻ tín dụng',
        required: false,
        validation: {
          min: 0,
          max: 1000000000
        }
      },

      // Thông tin vay vốn
      {
        id: 'so_tien_vay',
        type: 'number',
        label: 'Số tiền cần vay (VNĐ)',
        placeholder: 'Nhập số tiền cần vay',
        required: true,
        validation: {
          min: 1000000,
          max: 2000000000
        }
      },
      {
        id: 'thoi_han_vay',
        type: 'select',
        label: 'Thời hạn vay',
        required: true,
        options: [
          '6 tháng',
          '12 tháng',
          '18 tháng',
          '24 tháng',
          '36 tháng',
          '48 tháng',
          '60 tháng'
        ]
      },
      {
        id: 'muc_dich_vay',
        type: 'select',
        label: 'Mục đích vay',
        required: true,
        options: [
          'Tiêu dùng cá nhân',
          'Mua sắm',
          'Du lịch',
          'Y tế',
          'Giáo dục',
          'Kinh doanh',
          'Trả nợ',
          'Khác'
        ]
      },
      {
        id: 'hinh_thuc_tra_no',
        type: 'select',
        label: 'Hình thức trả nợ mong muốn',
        required: false,
        options: [
          'Trả đều hàng tháng',
          'Trả gốc cuối kỳ',
          'Trả linh hoạt'
        ]
      },

      // Thông tin liên hệ khẩn cấp
      {
        id: 'nguoi_lien_he_khan_cap',
        type: 'text',
        label: 'Người liên hệ khẩn cấp',
        placeholder: 'Họ tên người liên hệ khẩn cấp',
        required: false
      },
      {
        id: 'sdt_nguoi_lien_he',
        type: 'text',
        label: 'Số điện thoại người liên hệ khẩn cấp',
        placeholder: 'Số điện thoại người liên hệ',
        required: false
      },
      {
        id: 'moi_quan_he',
        type: 'select',
        label: 'Mối quan hệ với người liên hệ',
        required: false,
        options: [
          'Bố/Mẹ',
          'Anh/Chị/Em',
          'Vợ/Chồng',
          'Bạn bè',
          'Đồng nghiệp',
          'Khác'
        ]
      },

      // Ghi chú thêm
      {
        id: 'ghi_chu_them',
        type: 'textarea',
        label: 'Ghi chú thêm',
        placeholder: 'Thông tin bổ sung khác mà bạn muốn chia sẻ',
        required: false
      }
    ]
  },

  mortgage_loan: {
    productType: 'mortgage_loan',
    questions: [
      {
        id: 'property_type',
        type: 'select',
        label: 'Loại bất động sản',
        required: true,
        options: [
          'Căn hộ chung cư',
          'Nhà riêng',
          'Biệt thự',
          'Nhà phố',
          'Đất nền'
        ]
      },
      {
        id: 'property_value',
        type: 'number',
        label: 'Giá trị bất động sản (VNĐ)',
        placeholder: 'Nhập giá trị bất động sản',
        required: true,
        validation: {
          min: 500000000,
          max: 50000000000
        }
      },
      {
        id: 'down_payment',
        type: 'number',
        label: 'Số tiền trả trước (VNĐ)',
        placeholder: 'Nhập số tiền trả trước',
        required: true,
        validation: {
          min: 100000000,
          max: 10000000000
        }
      },
      {
        id: 'loan_term_years',
        type: 'select',
        label: 'Thời hạn vay (năm)',
        required: true,
        options: [
          '5 năm',
          '10 năm',
          '15 năm',
          '20 năm',
          '25 năm'
        ]
      },
      {
        id: 'monthly_income_mortgage',
        type: 'number',
        label: 'Thu nhập hàng tháng (VNĐ)',
        placeholder: 'Nhập thu nhập hàng tháng',
        required: true,
        validation: {
          min: 10000000,
          max: 500000000
        }
      },
      {
        id: 'employment_status',
        type: 'select',
        label: 'Tình trạng việc làm',
        required: true,
        options: [
          'Nhân viên chính thức',
          'Hợp đồng dài hạn',
          'Kinh doanh tự do',
          'Freelancer'
        ]
      }
    ]
  }
};
