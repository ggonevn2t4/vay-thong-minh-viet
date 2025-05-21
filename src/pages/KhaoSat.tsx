
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { analyzeUserResponse } from '@/services/openaiService';
import { formatCurrency } from '@/lib/utils';

const KhaoSat = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [surveyData, setSurveyData] = useState({
    thongTinCaNhan: {
      hoTen: '',
      email: '',
      soDienThoai: '',
      tuoi: '',
      gioiTinh: 'nam',
    },
    thongTinThuNhap: {
      thuNhapHangThang: '',
      chiPhiHangThang: '',
      nguonThuNhap: [],
      taiSan: '',
    },
    thongTinKhoanVay: {
      mucDichVay: 'muaNha',
      soTienVay: '',
      thoiHanVay: '3-5nam',
      taiSanTheChap: 'co',
      daVayTruocDay: 'khong',
    },
    yKienKhaoSat: {
      khoKhan: '',
      uuTien: [],
      mucDoSanSang: 50,
    },
  });

  const [ketQua, setKetQua] = useState({
    phanKhuc: '',
    khoangLaiSuat: '',
    danhGia: '',
    goiYNganHang: [],
    goiY: '',
  });

  const handleNext = async () => {
    // Validate form based on current step
    let isValid = true;
    
    if (currentStep === 1) {
      const { hoTen, email, soDienThoai } = surveyData.thongTinCaNhan;
      if (!hoTen || !email || !soDienThoai) {
        toast.error('Vui lòng điền đầy đủ thông tin cá nhân');
        isValid = false;
      } else if (!email.includes('@')) {
        toast.error('Email không hợp lệ');
        isValid = false;
      }
    } else if (currentStep === 2) {
      const { thuNhapHangThang, chiPhiHangThang } = surveyData.thongTinThuNhap;
      if (!thuNhapHangThang || !chiPhiHangThang) {
        toast.error('Vui lòng điền đầy đủ thông tin thu nhập');
        isValid = false;
      }
    } else if (currentStep === 3) {
      const { soTienVay } = surveyData.thongTinKhoanVay;
      if (!soTienVay) {
        toast.error('Vui lòng điền số tiền vay');
        isValid = false;
      }
    }
    
    if (!isValid) return;
    
    if (currentStep < 4) {
      // Go to next step
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit form
      await handleSubmitSurvey();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setSurveyData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section as keyof typeof prevData],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (section: string, field: string, value: string) => {
    setSurveyData(prevData => {
      const currentValues = prevData[section as keyof typeof prevData][field] as string[];
      if (currentValues.includes(value)) {
        return {
          ...prevData,
          [section]: {
            ...prevData[section as keyof typeof prevData],
            [field]: currentValues.filter(v => v !== value),
          },
        };
      } else {
        return {
          ...prevData,
          [section]: {
            ...prevData[section as keyof typeof prevData],
            [field]: [...currentValues, value],
          },
        };
      }
    });
  };

  const calculateLoanProfile = () => {
    // Tính phân khúc tín dụng
    const { thuNhapHangThang, chiPhiHangThang } = surveyData.thongTinThuNhap;
    const { soTienVay, thoiHanVay, taiSanTheChap } = surveyData.thongTinKhoanVay;
    
    const thuNhap = parseInt(thuNhapHangThang.replace(/[^0-9]/g, ''));
    const chiPhi = parseInt(chiPhiHangThang.replace(/[^0-9]/g, ''));
    const soTien = parseInt(soTienVay.replace(/[^0-9]/g, ''));
    
    // Tiền có thể trả nợ hàng tháng
    const khaDoiTra = thuNhap - chiPhi;
    
    // Ước tính thời hạn vay theo năm
    let thoiHan = 5;
    if (thoiHanVay === 'duoi12thang') thoiHan = 1;
    else if (thoiHanVay === '1-3nam') thoiHan = 3;
    else if (thoiHanVay === '3-5nam') thoiHan = 5;
    else if (thoiHanVay === '5-10nam') thoiHan = 10;
    else if (thoiHanVay === 'tren10nam') thoiHan = 20;
    
    // Ước tính tiền trả hàng tháng (với lãi suất trung bình 8%)
    const laiSuat = 0.08 / 12; // 8% hằng năm, 0.67% hàng tháng
    const soThang = thoiHan * 12;
    const tienTraHangThang = (soTien * laiSuat * Math.pow(1 + laiSuat, soThang)) / 
                            (Math.pow(1 + laiSuat, soThang) - 1);
    
    // Tỉ lệ trả nợ trên thu nhập
    const tiLe = tienTraHangThang / thuNhap;
    
    let phanKhuc, khoangLaiSuat, goiYNganHang, danhGia;
    
    // Đánh giá phân khúc tín dụng
    if (tiLe <= 0.3 && taiSanTheChap === 'co') {
      phanKhuc = 'Cao';
      khoangLaiSuat = '6% - 8%';
      danhGia = 'Khả năng vay rất tốt';
      goiYNganHang = ['Vietcombank', 'Techcombank', 'MB Bank'];
    } else if (tiLe <= 0.4) {
      phanKhuc = 'Trung bình';
      khoangLaiSuat = '8% - 10%';
      danhGia = 'Khả năng vay khá tốt, cần chuẩn bị thêm tài sản thế chấp';
      goiYNganHang = ['BIDV', 'VPBank', 'ACB'];
    } else {
      phanKhuc = 'Thấp';
      khoangLaiSuat = '10% - 14%';
      danhGia = 'Khả năng vay hạn chế, cần giảm số tiền vay hoặc tăng thời hạn vay';
      goiYNganHang = ['SHB', 'HDBank', 'OCB'];
    }
    
    // Gợi ý cá nhân hóa
    let goiY = '';
    if (tiLe > 0.5) {
      goiY = 'Bạn nên giảm số tiền vay xuống hoặc tăng thời hạn vay để giảm áp lực trả nợ hàng tháng.';
    } else if (thuNhap < 10000000) {
      goiY = 'Với mức thu nhập hiện tại, bạn nên tìm các gói vay ưu đãi dành cho khách hàng thu nhập thấp.';
    } else if (soTien > thuNhap * 36) {
      goiY = 'Số tiền vay khá cao so với thu nhập, bạn nên cân nhắc vay thêm người thân hoặc đồng vay.';
    } else {
      goiY = 'Hồ sơ vay của bạn khá tốt, bạn có thể đàm phán lãi suất tốt hơn với ngân hàng.';
    }
    
    return {
      phanKhuc,
      khoangLaiSuat,
      danhGia,
      goiYNganHang,
      goiY,
    };
  };

  const handleSubmitSurvey = async () => {
    setIsLoading(true);
    try {
      // Tính toán kết quả
      const result = calculateLoanProfile();
      
      // Phân tích phản hồi của người dùng bằng OpenAI
      if (surveyData.yKienKhaoSat.khoKhan) {
        try {
          const aiAnalysis = await analyzeUserResponse(surveyData.yKienKhaoSat.khoKhan);
          console.log('AI Analysis:', aiAnalysis);
          // Có thể sử dụng kết quả phân tích để điều chỉnh gợi ý
        } catch (error) {
          console.error('Error analyzing response:', error);
        }
      }
      
      setKetQua(result);
      
      // Lưu kết quả khảo sát vào localStorage
      const fullResult = {
        ...surveyData,
        ketQua: result,
        ngayKhaoSat: new Date().toISOString(),
      };
      
      localStorage.setItem('ketQuaKhaoSat', JSON.stringify(fullResult));
      
      // Chuyển đến trang kết quả
      navigate('/ket-qua');
      
      toast.success('Khảo sát đã hoàn thành!');
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast.error('Đã xảy ra lỗi khi xử lý khảo sát');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (value: string) => {
    // Chỉ giữ lại các chữ số
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Format với dấu phân cách hàng nghìn
    return numericValue === '' ? '' : formatCurrency(parseInt(numericValue));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Vui lòng cung cấp thông tin cá nhân chính xác để chúng tôi có thể đánh giá tốt nhất.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hoTen">Họ và tên <span className="text-red-500">*</span></Label>
                  <Input
                    id="hoTen"
                    placeholder="Nguyễn Văn A"
                    value={surveyData.thongTinCaNhan.hoTen}
                    onChange={(e) => handleInputChange('thongTinCaNhan', 'hoTen', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={surveyData.thongTinCaNhan.email}
                    onChange={(e) => handleInputChange('thongTinCaNhan', 'email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="soDienThoai">Số điện thoại <span className="text-red-500">*</span></Label>
                  <Input
                    id="soDienThoai"
                    placeholder="0912345678"
                    value={surveyData.thongTinCaNhan.soDienThoai}
                    onChange={(e) => handleInputChange('thongTinCaNhan', 'soDienThoai', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tuoi">Tuổi</Label>
                  <Input
                    id="tuoi"
                    placeholder="30"
                    value={surveyData.thongTinCaNhan.tuoi}
                    onChange={(e) => handleInputChange('thongTinCaNhan', 'tuoi', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    value={surveyData.thongTinCaNhan.gioiTinh}
                    onValueChange={(value) => handleInputChange('thongTinCaNhan', 'gioiTinh', value)}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nam" id="nam" />
                      <Label htmlFor="nam">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nu" id="nu" />
                      <Label htmlFor="nu">Nữ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="khac" id="khac" />
                      <Label htmlFor="khac">Khác</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => navigate('/')}>
                Hủy
              </Button>
              <Button onClick={handleNext}>
                Tiếp theo
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thu nhập</CardTitle>
              <CardDescription>
                Thông tin này giúp chúng tôi đánh giá khả năng trả nợ của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thuNhapHangThang">Thu nhập hàng tháng (VND) <span className="text-red-500">*</span></Label>
                  <Input
                    id="thuNhapHangThang"
                    placeholder="10,000,000"
                    value={surveyData.thongTinThuNhap.thuNhapHangThang}
                    onChange={(e) => {
                      const formattedValue = formatNumber(e.target.value);
                      handleInputChange('thongTinThuNhap', 'thuNhapHangThang', formattedValue);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chiPhiHangThang">Chi phí sinh hoạt hàng tháng (VND) <span className="text-red-500">*</span></Label>
                  <Input
                    id="chiPhiHangThang"
                    placeholder="5,000,000"
                    value={surveyData.thongTinThuNhap.chiPhiHangThang}
                    onChange={(e) => {
                      const formattedValue = formatNumber(e.target.value);
                      handleInputChange('thongTinThuNhap', 'chiPhiHangThang', formattedValue);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Nguồn thu nhập</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Lương', 'Kinh doanh', 'Cho thuê', 'Đầu tư', 'Khác'].map((option) => (
                      <div className="flex items-center space-x-2" key={option}>
                        <Checkbox
                          id={`nguonThuNhap-${option}`}
                          checked={(surveyData.thongTinThuNhap.nguonThuNhap as string[]).includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCheckboxChange('thongTinThuNhap', 'nguonThuNhap', option);
                            } else {
                              handleCheckboxChange('thongTinThuNhap', 'nguonThuNhap', option);
                            }
                          }}
                        />
                        <Label htmlFor={`nguonThuNhap-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taiSan">Tài sản hiện có</Label>
                  <Textarea
                    id="taiSan"
                    placeholder="Nhà, đất, xe cộ, tiền tiết kiệm..."
                    value={surveyData.thongTinThuNhap.taiSan}
                    onChange={(e) => handleInputChange('thongTinThuNhap', 'taiSan', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={handleBack}>
                Quay lại
              </Button>
              <Button onClick={handleNext}>
                Tiếp theo
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khoản vay</CardTitle>
              <CardDescription>
                Cho chúng tôi biết nhu cầu vay vốn của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Mục đích vay</Label>
                  <RadioGroup
                    value={surveyData.thongTinKhoanVay.mucDichVay}
                    onValueChange={(value) => handleInputChange('thongTinKhoanVay', 'mucDichVay', value)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="muaNha" id="muaNha" />
                      <Label htmlFor="muaNha">Mua nhà</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="muaXe" id="muaXe" />
                      <Label htmlFor="muaXe">Mua xe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kinhDoanh" id="kinhDoanh" />
                      <Label htmlFor="kinhDoanh">Kinh doanh</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tieuDung" id="tieuDung" />
                      <Label htmlFor="tieuDung">Tiêu dùng</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="soTienVay">Số tiền vay (VND) <span className="text-red-500">*</span></Label>
                  <Input
                    id="soTienVay"
                    placeholder="500,000,000"
                    value={surveyData.thongTinKhoanVay.soTienVay}
                    onChange={(e) => {
                      const formattedValue = formatNumber(e.target.value);
                      handleInputChange('thongTinKhoanVay', 'soTienVay', formattedValue);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Thời hạn vay</Label>
                  <RadioGroup
                    value={surveyData.thongTinKhoanVay.thoiHanVay}
                    onValueChange={(value) => handleInputChange('thongTinKhoanVay', 'thoiHanVay', value)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="duoi12thang" id="duoi12thang" />
                      <Label htmlFor="duoi12thang">Dưới 12 tháng</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-3nam" id="1-3nam" />
                      <Label htmlFor="1-3nam">1 - 3 năm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-5nam" id="3-5nam" />
                      <Label htmlFor="3-5nam">3 - 5 năm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5-10nam" id="5-10nam" />
                      <Label htmlFor="5-10nam">5 - 10 năm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tren10nam" id="tren10nam" />
                      <Label htmlFor="tren10nam">Trên 10 năm</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Tài sản thế chấp</Label>
                  <RadioGroup
                    value={surveyData.thongTinKhoanVay.taiSanTheChap}
                    onValueChange={(value) => handleInputChange('thongTinKhoanVay', 'taiSanTheChap', value)}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="co" id="co" />
                      <Label htmlFor="co">Có</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="khong" id="khong" />
                      <Label htmlFor="khong">Không</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Đã từng vay ngân hàng trước đây</Label>
                  <RadioGroup
                    value={surveyData.thongTinKhoanVay.daVayTruocDay}
                    onValueChange={(value) => handleInputChange('thongTinKhoanVay', 'daVayTruocDay', value)}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="co" id="daTungVay" />
                      <Label htmlFor="daTungVay">Có</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="khong" id="chuaTungVay" />
                      <Label htmlFor="chuaTungVay">Không</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={handleBack}>
                Quay lại
              </Button>
              <Button onClick={handleNext}>
                Tiếp theo
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Ý kiến khảo sát</CardTitle>
              <CardDescription>
                Cho chúng tôi biết thêm về mong muốn của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="khoKhan">Khó khăn bạn gặp phải khi vay vốn</Label>
                  <Textarea
                    id="khoKhan"
                    placeholder="Mô tả khó khăn bạn gặp phải..."
                    value={surveyData.yKienKhaoSat.khoKhan}
                    onChange={(e) => handleInputChange('yKienKhaoSat', 'khoKhan', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Ưu tiên khi chọn khoản vay</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Lãi suất thấp', 'Thủ tục đơn giản', 'Giải ngân nhanh', 'Thời hạn linh hoạt', 'Phí trả nợ sớm thấp'].map((option) => (
                      <div className="flex items-center space-x-2" key={option}>
                        <Checkbox
                          id={`uuTien-${option}`}
                          checked={(surveyData.yKienKhaoSat.uuTien as string[]).includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCheckboxChange('yKienKhaoSat', 'uuTien', option);
                            } else {
                              handleCheckboxChange('yKienKhaoSat', 'uuTien', option);
                            }
                          }}
                        />
                        <Label htmlFor={`uuTien-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Mức độ sẵn sàng vay vốn: {surveyData.yKienKhaoSat.mucDoSanSang}%</Label>
                  </div>
                  <Slider
                    value={[surveyData.yKienKhaoSat.mucDoSanSang as number]}
                    onValueChange={(value) => handleInputChange('yKienKhaoSat', 'mucDoSanSang', value[0])}
                    max={100}
                    step={10}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Đang cân nhắc</span>
                    <span>Rất sẵn sàng</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={handleBack}>
                Quay lại
              </Button>
              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Hoàn thành khảo sát'}
              </Button>
            </CardFooter>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Khảo sát nhu cầu vay vốn</h1>
        <p className="text-muted-foreground text-center mb-6">
          Hoàn thành khảo sát để nhận đánh giá chi tiết về khả năng vay vốn của bạn
        </p>
        
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : step < currentStep 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground'
                } text-sm font-medium`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Thông tin cá nhân</span>
            <span>Thu nhập</span>
            <span>Khoản vay</span>
            <span>Khảo sát</span>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </Layout>
  );
};

export default KhaoSat;
