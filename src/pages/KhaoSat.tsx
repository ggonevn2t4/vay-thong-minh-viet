
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const KhaoSat = () => {
  const navigate = useNavigate();
  
  // State để theo dõi các bước khảo sát
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Thông tin cá nhân
    fullName: '',
    age: '',
    gender: '',
    city: '',
    district: '',
    phoneNumber: '',
    email: '',
    job: '',
    workplace: '',
    workDuration: '',
    
    // Thông tin tài chính
    monthlyIncome: '',
    additionalIncome: '',
    currentDebt: '',
    monthlyExpenses: '',
    
    // Lịch sử tín dụng
    creditHistory: 'none', // none, good, bad, unknown
    badDebtHistory: 'none', // none, group1, group2, group3, group4, group5
    existingLoans: '',
    
    // Mục đích vay
    loanPurpose: '',
    loanAmount: '',
    loanDuration: '',
    
    // Tài sản đảm bảo
    collateralType: '',
    collateralValue: '',
    
    // Thông tin bổ sung
    familySize: '',
    maritalStatus: '',
    dependents: '',
    homeOwnership: '',
    
    // Thông tin thuế
    taxId: '',
    taxReturnStatus: '',
    
    // Đồng ý với điều khoản
    agreeTerms: false,
    allowContact: false,
  });
  
  // Danh sách các bước khảo sát
  const steps = [
    {
      id: 'personal',
      title: 'Thông tin cá nhân',
      description: 'Thông tin cơ bản về bạn',
      fields: ['fullName', 'age', 'gender', 'city', 'district', 'phoneNumber', 'email']
    },
    {
      id: 'employment',
      title: 'Thông tin việc làm',
      description: 'Thông tin về công việc hiện tại của bạn',
      fields: ['job', 'workplace', 'workDuration']
    },
    {
      id: 'financial',
      title: 'Thông tin tài chính',
      description: 'Thông tin về thu nhập và chi tiêu của bạn',
      fields: ['monthlyIncome', 'additionalIncome', 'currentDebt', 'monthlyExpenses']
    },
    {
      id: 'credit',
      title: 'Lịch sử tín dụng',
      description: 'Thông tin về lịch sử tín dụng của bạn',
      fields: ['creditHistory', 'badDebtHistory', 'existingLoans']
    },
    {
      id: 'loan',
      title: 'Khoản vay mong muốn',
      description: 'Thông tin về khoản vay bạn muốn tìm kiếm',
      fields: ['loanPurpose', 'loanAmount', 'loanDuration']
    },
    {
      id: 'collateral',
      title: 'Tài sản đảm bảo',
      description: 'Thông tin về tài sản đảm bảo (nếu có)',
      fields: ['collateralType', 'collateralValue']
    },
    {
      id: 'additional',
      title: 'Thông tin bổ sung',
      description: 'Thông tin bổ sung để đánh giá chính xác hơn',
      fields: ['familySize', 'maritalStatus', 'dependents', 'homeOwnership', 'taxId']
    },
    {
      id: 'confirm',
      title: 'Xác nhận thông tin',
      description: 'Xác nhận thông tin và đồng ý với điều khoản',
      fields: ['agreeTerms', 'allowContact']
    }
  ];
  
  // Hàm xử lý thay đổi giá trị form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Logic điều kiện: nếu có nợ xấu nhóm 2 trở lên, tự động chuyển đến bước cuối cùng
    if (name === 'badDebtHistory' && ['group2', 'group3', 'group4', 'group5'].includes(value)) {
      // Đánh dấu là không đủ điều kiện và chuyển đến trang kết quả
      setTimeout(() => {
        navigate('/ket-qua', { 
          state: { 
            eligibility: false,
            reason: 'Lịch sử nợ xấu nhóm 2 trở lên',
            score: 0
          } 
        });
      }, 500);
    }
  };
  
  // Hàm xử lý nút Next
  const handleNext = () => {
    // Logic kiểm tra trường dữ liệu bắt buộc
    const currentFields = steps[currentStep].fields;
    const isValid = currentFields.every(field => {
      // Bỏ qua các trường không bắt buộc
      if (['additionalIncome', 'collateralType', 'collateralValue', 'taxId', 'allowContact'].includes(field)) {
        return true;
      }
      return formData[field as keyof typeof formData];
    });
    
    if (!isValid) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc trước khi tiếp tục.');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Nếu đây là bước cuối cùng, chuyển đến trang kết quả
      calculateScore();
    }
  };
  
  // Hàm xử lý nút Back
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Hàm tính điểm khách hàng
  const calculateScore = () => {
    let score = 0;
    let maxScore = 100;
    
    // Tính điểm dựa trên thu nhập (20%)
    const income = parseInt(formData.monthlyIncome) || 0;
    if (income > 20000000) score += 20;
    else if (income > 15000000) score += 16;
    else if (income > 10000000) score += 12;
    else if (income > 5000000) score += 8;
    else score += 4;
    
    // Tính điểm dựa trên lịch sử tín dụng (25%)
    if (formData.creditHistory === 'good') score += 25;
    else if (formData.creditHistory === 'none') score += 15;
    else if (formData.creditHistory === 'bad') score += 5;
    
    // Trừ điểm nếu có nợ xấu
    if (formData.badDebtHistory === 'group1') score -= 10;
    
    // Tính điểm dựa trên tài sản đảm bảo (20%)
    if (formData.collateralType && formData.collateralValue) {
      const collateralValue = parseInt(formData.collateralValue) || 0;
      const loanAmount = parseInt(formData.loanAmount) || 1;
      if (collateralValue > loanAmount * 2) score += 20;
      else if (collateralValue > loanAmount * 1.5) score += 15;
      else if (collateralValue > loanAmount) score += 10;
      else score += 5;
    }
    
    // Tính điểm khả năng trả nợ (25%)
    const monthlyExpenses = parseInt(formData.monthlyExpenses) || 0;
    const currentDebt = parseInt(formData.currentDebt) || 0;
    const debtToIncomeRatio = (monthlyExpenses + currentDebt) / income;
    
    if (debtToIncomeRatio < 0.3) score += 25;
    else if (debtToIncomeRatio < 0.5) score += 20;
    else if (debtToIncomeRatio < 0.7) score += 10;
    else score += 5;
    
    // Điểm các yếu tố khác (10%)
    if (formData.workDuration === '5+') score += 10;
    else if (formData.workDuration === '3-5') score += 8;
    else if (formData.workDuration === '1-3') score += 5;
    else score += 2;
    
    // Giới hạn điểm tối đa và tối thiểu
    score = Math.min(Math.max(score, 0), maxScore);
    
    // Phân loại khách hàng
    let category = '';
    if (score >= 80) category = 'A';
    else if (score >= 60) category = 'B';
    else if (score >= 40) category = 'C';
    else category = 'D';
    
    // Kiểm tra đủ điều kiện vay
    const eligible = score >= 40;
    
    // Chuyển đến trang kết quả với thông tin đánh giá
    navigate('/ket-qua', { 
      state: { 
        eligibility: eligible,
        score: score,
        category: category,
        formData: formData
      } 
    });
  };
  
  // Render các trường dữ liệu dựa trên bước hiện tại
  const renderFields = () => {
    const currentFields = steps[currentStep].fields;
    
    return (
      <div className="space-y-4">
        {currentFields.includes('fullName') && (
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Họ và tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('age') && (
          <div className="form-group">
            <label htmlFor="age" className="form-label">Tuổi <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="age"
              name="age"
              min="18"
              max="100"
              value={formData.age}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('gender') && (
          <div className="form-group">
            <label htmlFor="gender" className="form-label">Giới tính <span className="text-red-500">*</span></label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('city') && (
          <div className="form-group">
            <label htmlFor="city" className="form-label">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hochiminh">TP. Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
              <option value="other">Khác</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('district') && (
          <div className="form-group">
            <label htmlFor="district" className="form-label">Quận/Huyện <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('phoneNumber') && (
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Số điện thoại <span className="text-red-500">*</span></label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('email') && (
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('job') && (
          <div className="form-group">
            <label htmlFor="job" className="form-label">Nghề nghiệp <span className="text-red-500">*</span></label>
            <select
              id="job"
              name="job"
              value={formData.job}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="private">Nhân viên công ty tư nhân</option>
              <option value="state">Nhân viên công ty nhà nước</option>
              <option value="business">Chủ doanh nghiệp</option>
              <option value="freelance">Tự do</option>
              <option value="retired">Nghỉ hưu</option>
              <option value="other">Khác</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('workplace') && (
          <div className="form-group">
            <label htmlFor="workplace" className="form-label">Nơi làm việc <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="workplace"
              name="workplace"
              value={formData.workplace}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('workDuration') && (
          <div className="form-group">
            <label htmlFor="workDuration" className="form-label">Thời gian làm việc <span className="text-red-500">*</span></label>
            <select
              id="workDuration"
              name="workDuration"
              value={formData.workDuration}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="<1">Dưới 1 năm</option>
              <option value="1-3">1 - 3 năm</option>
              <option value="3-5">3 - 5 năm</option>
              <option value="5+">Trên 5 năm</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('monthlyIncome') && (
          <div className="form-group">
            <label htmlFor="monthlyIncome" className="form-label">Thu nhập hàng tháng (VNĐ) <span className="text-red-500">*</span></label>
            <select
              id="monthlyIncome"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="<5000000">Dưới 5 triệu</option>
              <option value="5000000-10000000">5 - 10 triệu</option>
              <option value="10000000-15000000">10 - 15 triệu</option>
              <option value="15000000-20000000">15 - 20 triệu</option>
              <option value="20000000-30000000">20 - 30 triệu</option>
              <option value="30000000+">Trên 30 triệu</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('additionalIncome') && (
          <div className="form-group">
            <label htmlFor="additionalIncome" className="form-label">Thu nhập phụ (VNĐ)</label>
            <input
              type="number"
              id="additionalIncome"
              name="additionalIncome"
              value={formData.additionalIncome}
              onChange={handleChange}
              className="form-input"
              placeholder="Nếu có"
            />
          </div>
        )}
        
        {currentFields.includes('currentDebt') && (
          <div className="form-group">
            <label htmlFor="currentDebt" className="form-label">Nợ hiện tại mỗi tháng (VNĐ) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="currentDebt"
              name="currentDebt"
              value={formData.currentDebt}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('monthlyExpenses') && (
          <div className="form-group">
            <label htmlFor="monthlyExpenses" className="form-label">Chi tiêu hàng tháng (VNĐ) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="monthlyExpenses"
              name="monthlyExpenses"
              value={formData.monthlyExpenses}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('creditHistory') && (
          <div className="form-group">
            <label htmlFor="creditHistory" className="form-label">Lịch sử tín dụng <span className="text-red-500">*</span></label>
            <select
              id="creditHistory"
              name="creditHistory"
              value={formData.creditHistory}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="good">Tốt (luôn trả nợ đúng hạn)</option>
              <option value="bad">Có vấn đề (đã trễ hạn một số lần)</option>
              <option value="none">Chưa có lịch sử tín dụng</option>
              <option value="unknown">Không biết</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('badDebtHistory') && (
          <div className="form-group">
            <label htmlFor="badDebtHistory" className="form-label">Lịch sử nợ xấu <span className="text-red-500">*</span></label>
            <select
              id="badDebtHistory"
              name="badDebtHistory"
              value={formData.badDebtHistory}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="none">Không có nợ xấu</option>
              <option value="group1">Nợ nhóm 1 (Nợ đủ tiêu chuẩn)</option>
              <option value="group2">Nợ nhóm 2 (Nợ cần chú ý)</option>
              <option value="group3">Nợ nhóm 3 (Nợ dưới tiêu chuẩn)</option>
              <option value="group4">Nợ nhóm 4 (Nợ nghi ngờ)</option>
              <option value="group5">Nợ nhóm 5 (Nợ có khả năng mất vốn)</option>
            </select>
            {formData.badDebtHistory && formData.badDebtHistory !== 'none' && formData.badDebtHistory !== 'group1' && (
              <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                <p className="font-semibold">Chú ý:</p>
                <p>Nợ xấu từ nhóm 2 trở lên có thể ảnh hưởng đến khả năng được phê duyệt khoản vay.</p>
              </div>
            )}
          </div>
        )}
        
        {currentFields.includes('existingLoans') && (
          <div className="form-group">
            <label htmlFor="existingLoans" className="form-label">Số khoản vay hiện tại <span className="text-red-500">*</span></label>
            <select
              id="existingLoans"
              name="existingLoans"
              value={formData.existingLoans}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="0">Không có</option>
              <option value="1">1 khoản vay</option>
              <option value="2">2 khoản vay</option>
              <option value="3+">3 khoản vay trở lên</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('loanPurpose') && (
          <div className="form-group">
            <label htmlFor="loanPurpose" className="form-label">Mục đích vay <span className="text-red-500">*</span></label>
            <select
              id="loanPurpose"
              name="loanPurpose"
              value={formData.loanPurpose}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="home">Mua nhà</option>
              <option value="car">Mua xe</option>
              <option value="business">Kinh doanh</option>
              <option value="education">Học tập</option>
              <option value="travel">Du lịch</option>
              <option value="medical">Y tế</option>
              <option value="personal">Tiêu dùng cá nhân</option>
              <option value="other">Khác</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('loanAmount') && (
          <div className="form-group">
            <label htmlFor="loanAmount" className="form-label">Số tiền muốn vay (VNĐ) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('loanDuration') && (
          <div className="form-group">
            <label htmlFor="loanDuration" className="form-label">Thời gian vay <span className="text-red-500">*</span></label>
            <select
              id="loanDuration"
              name="loanDuration"
              value={formData.loanDuration}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="6">6 tháng</option>
              <option value="12">12 tháng</option>
              <option value="24">24 tháng</option>
              <option value="36">36 tháng</option>
              <option value="48">48 tháng</option>
              <option value="60">60 tháng</option>
              <option value="120">120 tháng</option>
              <option value="180">180 tháng</option>
              <option value="240">240 tháng</option>
              <option value="300">300 tháng</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('collateralType') && (
          <div className="form-group">
            <label htmlFor="collateralType" className="form-label">Loại tài sản đảm bảo</label>
            <select
              id="collateralType"
              name="collateralType"
              value={formData.collateralType}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">-- Không có --</option>
              <option value="property">Bất động sản</option>
              <option value="vehicle">Xe ô tô</option>
              <option value="savings">Sổ tiết kiệm</option>
              <option value="other">Khác</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('collateralValue') && formData.collateralType && (
          <div className="form-group">
            <label htmlFor="collateralValue" className="form-label">Giá trị tài sản đảm bảo (VNĐ)</label>
            <input
              type="number"
              id="collateralValue"
              name="collateralValue"
              value={formData.collateralValue}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        )}
        
        {currentFields.includes('familySize') && (
          <div className="form-group">
            <label htmlFor="familySize" className="form-label">Số người trong gia đình <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="familySize"
              name="familySize"
              min="1"
              value={formData.familySize}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('maritalStatus') && (
          <div className="form-group">
            <label htmlFor="maritalStatus" className="form-label">Tình trạng hôn nhân <span className="text-red-500">*</span></label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="single">Độc thân</option>
              <option value="married">Đã kết hôn</option>
              <option value="divorced">Ly hôn</option>
              <option value="other">Khác</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('dependents') && (
          <div className="form-group">
            <label htmlFor="dependents" className="form-label">Số người phụ thuộc <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="dependents"
              name="dependents"
              min="0"
              value={formData.dependents}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        )}
        
        {currentFields.includes('homeOwnership') && (
          <div className="form-group">
            <label htmlFor="homeOwnership" className="form-label">Tình trạng nhà ở <span className="text-red-500">*</span></label>
            <select
              id="homeOwnership"
              name="homeOwnership"
              value={formData.homeOwnership}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">-- Chọn --</option>
              <option value="own">Sở hữu</option>
              <option value="mortgage">Đang vay mua</option>
              <option value="rent">Đang thuê</option>
              <option value="family">Sống cùng gia đình</option>
              <option value="other">Khác</option>
            </select>
          </div>
        )}
        
        {currentFields.includes('taxId') && (
          <div className="form-group">
            <label htmlFor="taxId" className="form-label">Mã số thuế cá nhân</label>
            <input
              type="text"
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        )}
        
        {currentFields.includes('agreeTerms') && (
          <div className="form-group mt-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms as boolean}
                onChange={handleChange}
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="agreeTerms" className="text-sm">
                Tôi xác nhận rằng thông tin đã cung cấp là chính xác và đồng ý với <a href="/dieu-khoan-su-dung" className="text-brand-600 hover:underline">Điều khoản sử dụng</a> và <a href="/chinh-sach-bao-mat" className="text-brand-600 hover:underline">Chính sách bảo mật</a> của VayThôngMinh. <span className="text-red-500">*</span>
              </label>
            </div>
          </div>
        )}
        
        {currentFields.includes('allowContact') && (
          <div className="form-group">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="allowContact"
                name="allowContact"
                checked={formData.allowContact as boolean}
                onChange={handleChange}
                className="mt-1 mr-2"
              />
              <label htmlFor="allowContact" className="text-sm">
                Tôi đồng ý nhận thông tin cập nhật và ưu đãi từ VayThôngMinh qua email hoặc SMS.
              </label>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Khảo sát đánh giá khả năng vay vốn</h1>
            <p className="text-gray-600">
              Hoàn thành mẫu khảo sát dưới đây để nhận đánh giá và đề xuất khoản vay phù hợp với bạn.
            </p>
          </div>
          
          {/* Progress steps */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-brand-600 h-2.5 rounded-full" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-brand-600 font-medium">Bước {currentStep + 1}/{steps.length}</span>
              <span className="text-sm text-gray-500">{steps[currentStep].title}</span>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderFields()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Quay lại
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!formData.agreeTerms && currentStep === steps.length - 1}
              >
                {currentStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Thông tin quan trọng</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm text-blue-800">Thông tin của tôi có được bảo mật không?</AccordionTrigger>
                      <AccordionContent className="text-sm">
                        Thông tin của bạn được bảo mật tuyệt đối và chỉ được sử dụng cho mục đích đánh giá khả năng vay vốn. Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba khi chưa có sự đồng ý.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm text-blue-800">Khảo sát này có ràng buộc tôi phải vay không?</AccordionTrigger>
                      <AccordionContent className="text-sm">
                        Không. Khảo sát này chỉ giúp bạn đánh giá khả năng vay vốn và nhận đề xuất các khoản vay phù hợp. Bạn hoàn toàn có quyền quyết định có nộp hồ sơ vay hay không.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm text-blue-800">Kết quả có chính xác 100% không?</AccordionTrigger>
                      <AccordionContent className="text-sm">
                        Kết quả đánh giá dựa trên thông tin bạn cung cấp và các tiêu chí chung của ngân hàng. Tuy nhiên, quyết định cuối cùng phụ thuộc vào chính sách của từng ngân hàng tại thời điểm bạn nộp hồ sơ.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KhaoSat;
