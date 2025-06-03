
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    // 1. Thông tin cá nhân
    thongTinCaNhan: {
      hoTen: '',
      ngaySinh: '',
      gioiTinh: 'nam',
      tinhTrangHonNhan: 'docThan',
      quocTich: 'vietNam',
      tinhTrangCuTru: 'cuTru',
      thoiHanConLai: '',
      tinhTrangSoHuuNha: 'khong',
      lyLichTuPhap: 'tot',
      // Thông tin vợ/chồng
      hoTenVoChong: '',
      ngaySinhVoChong: '',
      ngheNghiepVoChong: '',
      thuNhapVoChong: '',
    },
    // 2. Liên hệ
    lienHe: {
      soDienThoai: '',
      email: '',
      thanhPho: '',
      quanHuyen: '',
      phuongXa: '',
      soNhaDuong: '',
    },
    // 3. Thông tin gia đình
    thongTinGiaDinh: {
      soNguoiPhuThuoc: 0,
      treEm: 0,
      nguoiLon: 0,
    },
    // 4. Học vấn
    hocVan: {
      trinhDoHocVan: 'duoi-trung-cap',
      chuyenNganh: '',
    },
    // 5. Thông tin nghề nghiệp và tài chính
    thongTinNgheNghiep: {
      loaiHinhNgheNghiep: 'lamCongAnLuong',
      // Làm công ăn lương
      tenCoQuan: '',
      viTriCongViec: 'chuyenVien',
      nganhNghe: 'congNgheThongTin',
      loaiHopDong: 'khongXacDinhThoiHan',
      thoiGianCongTac: '',
      hinhThucNhanLuong: 'chuyenKhoan',
      nganHangNhanLuong: '',
      thuNhapGop: '',
      // Tự kinh doanh
      tenDoanhNghiep: '',
      nganhNgheKinhDoanh: 'congNgheThongTin',
      loaiHinhKinhDoanh: 'caNhan',
      thoiGianHoatDong: '',
      // Tự kinh doanh có chứng chỉ
      nganhNgheChungChi: '',
      thoiGianTrongLinhVuc: '',
      // Nhóm khác
      nguonThuNhap: '',
    },
    // 6. Khả năng tài chính
    khaNangTaiChinh: {
      chiPhiSinhHoat: '',
      coKhoanVay: 'khong',
      soTienTraHangThang: '',
    },
    // 7. Lịch sử tín dụng
    lichSuTinDung: {
      daTungVayVon: 'khong',
      traNoCham: 'khongBaoGio',
      noXau: 'khong',
    },
    // 8. Mục đích vay
    mucDichVay: {
      loaiHinhVay: 'theChap',
      soTienVay: '',
      mucDichCuThe: '',
      thoiGianTraNo: '',
    },
    // 9. Tài sản bảo đảm
    taiSanBaoDam: {
      coTaiSan: 'co',
      loaiTaiSan: 'batDongSan',
      // Bất động sản
      loaiBatDongSan: 'nhaODatO',
      coNhaTrenDat: 'co',
      dienTichNha: '',
      daHoanCong: 'co',
      diaChiThanhPho: '',
      diaChiQuanHuyen: '',
      diaChiPhuongXa: '',
      diaChiSoNha: '',
      soThuaDat: '',
      toBanDoSo: '',
      dienTichLoDat: '',
      giaTriUocTinh: '',
      tinhTrangSoHuu: 'soHuuHoanToan',
      chuSoHuu: 'soHuuRieng',
      mucDichSuDung: 'doiSong',
      // Xe ô tô
      thuongHieuXe: '',
      loaiXe: 'xeDuLich',
      giaTriXe: '',
      tinhTrangSoHuuXe: 'soHuuHoanToan',
      chuSoHuuXe: '',
      // Tiền gửi
      loaiTienGui: 'tienMat',
      giaTriTienGui: '',
      noiPhatHanh: 'vietcombank',
      // Trái phiếu
      loaiTraiPhieu: 'traiPhieuChinhPhu',
      giaTriTraiPhieu: '',
      // Chung
      dangTheChapNoiKhac: 'khong',
      sanSangDungTaiSan: 'co',
    },
    // Nhu cầu khác
    nhuCauKhac: '',
  });

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = async () => {
    // Validate current step
    let isValid = true;
    let errorMessage = '';

    if (currentStep === 1) {
      const { hoTen, ngaySinh, soDienThoai } = surveyData.thongTinCaNhan;
      const { soDienThoai: phone } = surveyData.lienHe;
      
      if (!hoTen || !ngaySinh || !phone) {
        errorMessage = 'Vui lòng điền đầy đủ thông tin bắt buộc';
        isValid = false;
      } else if (surveyData.thongTinCaNhan.lyLichTuPhap === 'coTienAn') {
        errorMessage = 'Xin lỗi, chúng tôi không thể hỗ trợ khách hàng có tiền án, tiền sự';
        isValid = false;
      } else if (calculateAge(ngaySinh) < 18) {
        errorMessage = 'Khách hàng phải từ 18 tuổi trở lên';
        isValid = false;
      }
    } else if (currentStep === 2) {
      const { thuNhapGop } = surveyData.thongTinNgheNghiep;
      const { chiPhiSinhHoat } = surveyData.khaNangTaiChinh;
      
      if (!thuNhapGop || !chiPhiSinhHoat) {
        errorMessage = 'Vui lòng điền đầy đủ thông tin thu nhập và chi phí';
        isValid = false;
      }
    } else if (currentStep === 3) {
      const { soTienVay, thoiGianTraNo } = surveyData.mucDichVay;
      
      if (!soTienVay || !thoiGianTraNo) {
        errorMessage = 'Vui lòng điền đầy đủ thông tin khoản vay';
        isValid = false;
      } else if (surveyData.lichSuTinDung.noXau === 'co') {
        errorMessage = 'Xin lỗi, chúng tôi không thể hỗ trợ khách hàng có nợ xấu';
        isValid = false;
      }
      
      // Validate age at loan end
      const age = calculateAge(surveyData.thongTinCaNhan.ngaySinh);
      const loanTerm = parseInt(thoiGianTraNo);
      if (age + loanTerm > 75) {
        errorMessage = 'Tuổi khi kết thúc khoản vay không được quá 75 tuổi';
        isValid = false;
      }
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
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

  const handleSubmitSurvey = async () => {
    setIsLoading(true);
    try {
      // Save survey result to localStorage
      const fullResult = {
        ...surveyData,
        ngayKhaoSat: new Date().toISOString(),
      };
      
      localStorage.setItem('ketQuaKhaoSat', JSON.stringify(fullResult));
      
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
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue === '' ? '' : formatCurrency(parseInt(numericValue));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Bước 1: Thông tin cá nhân và liên hệ</CardTitle>
              <CardDescription>
                Vui lòng cung cấp thông tin cá nhân chính xác
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thông tin cá nhân */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="ngaySinh">Ngày sinh <span className="text-red-500">*</span></Label>
                    <Input
                      id="ngaySinh"
                      type="date"
                      value={surveyData.thongTinCaNhan.ngaySinh}
                      onChange={(e) => handleInputChange('thongTinCaNhan', 'ngaySinh', e.target.value)}
                    />
                    {surveyData.thongTinCaNhan.ngaySinh && (
                      <p className="text-sm text-gray-600">
                        Tuổi: {calculateAge(surveyData.thongTinCaNhan.ngaySinh)} tuổi
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Giới tính <span className="text-red-500">*</span></Label>
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
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tình trạng hôn nhân <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.thongTinCaNhan.tinhTrangHonNhan}
                      onValueChange={(value) => handleInputChange('thongTinCaNhan', 'tinhTrangHonNhan', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docThan">Độc thân</SelectItem>
                        <SelectItem value="daKetHon">Đã kết hôn</SelectItem>
                        <SelectItem value="daLyHon">Đã ly hôn</SelectItem>
                        <SelectItem value="goa">Góa</SelectItem>
                        <SelectItem value="lyThan">Ly thân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quốc tịch <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.thongTinCaNhan.quocTich}
                      onValueChange={(value) => handleInputChange('thongTinCaNhan', 'quocTich', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vietNam">Việt Nam</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tình trạng cư trú <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.thongTinCaNhan.tinhTrangCuTru}
                      onValueChange={(value) => handleInputChange('thongTinCaNhan', 'tinhTrangCuTru', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cuTru">Cư trú</SelectItem>
                        <SelectItem value="khongCuTru">Không cư trú</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {surveyData.thongTinCaNhan.tinhTrangCuTru === 'khongCuTru' && (
                    <div className="space-y-2">
                      <Label htmlFor="thoiHanConLai">Thời hạn còn lại tại Việt Nam (tháng)</Label>
                      <Input
                        id="thoiHanConLai"
                        type="number"
                        placeholder="12"
                        value={surveyData.thongTinCaNhan.thoiHanConLai}
                        onChange={(e) => handleInputChange('thongTinCaNhan', 'thoiHanConLai', e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Tình trạng sở hữu nhà <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.thongTinCaNhan.tinhTrangSoHuuNha}
                      onValueChange={(value) => handleInputChange('thongTinCaNhan', 'tinhTrangSoHuuNha', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="khong">Không</SelectItem>
                        <SelectItem value="soHuu">Sở hữu</SelectItem>
                        <SelectItem value="soHuuTraGop">Sở hữu và trả góp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Lý lịch tư pháp <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.thongTinCaNhan.lyLichTuPhap}
                      onValueChange={(value) => handleInputChange('thongTinCaNhan', 'lyLichTuPhap', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tot">Tốt</SelectItem>
                        <SelectItem value="coTienAn">Có tiền án, tiền sự hoặc đang bị truy tố</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Thông tin vợ/chồng nếu đã kết hôn */}
              {surveyData.thongTinCaNhan.tinhTrangHonNhan === 'daKetHon' && (
                <div>
                  <Separator />
                  <h3 className="text-lg font-semibold mb-4 mt-4">Thông tin vợ/chồng (người đồng vay)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hoTenVoChong">Họ và tên vợ/chồng <span className="text-red-500">*</span></Label>
                      <Input
                        id="hoTenVoChong"
                        placeholder="Nguyễn Thị B"
                        value={surveyData.thongTinCaNhan.hoTenVoChong}
                        onChange={(e) => handleInputChange('thongTinCaNhan', 'hoTenVoChong', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ngaySinhVoChong">Ngày sinh vợ/chồng <span className="text-red-500">*</span></Label>
                      <Input
                        id="ngaySinhVoChong"
                        type="date"
                        value={surveyData.thongTinCaNhan.ngaySinhVoChong}
                        onChange={(e) => handleInputChange('thongTinCaNhan', 'ngaySinhVoChong', e.target.value)}
                      />
                      {surveyData.thongTinCaNhan.ngaySinhVoChong && (
                        <p className="text-sm text-gray-600">
                          Tuổi: {calculateAge(surveyData.thongTinCaNhan.ngaySinhVoChong)} tuổi
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ngheNghiepVoChong">Nghề nghiệp vợ/chồng <span className="text-red-500">*</span></Label>
                      <Input
                        id="ngheNghiepVoChong"
                        placeholder="Mô tả ngắn gọn"
                        value={surveyData.thongTinCaNhan.ngheNghiepVoChong}
                        onChange={(e) => handleInputChange('thongTinCaNhan', 'ngheNghiepVoChong', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="thuNhapVoChong">Thu nhập gộp hàng tháng của vợ/chồng (triệu VND) <span className="text-red-500">*</span></Label>
                      <Input
                        id="thuNhapVoChong"
                        type="number"
                        placeholder="10"
                        value={surveyData.thongTinCaNhan.thuNhapVoChong}
                        onChange={(e) => handleInputChange('thongTinCaNhan', 'thuNhapVoChong', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Thông tin liên hệ */}
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4 mt-4">Thông tin liên hệ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soDienThoai">Số điện thoại <span className="text-red-500">*</span></Label>
                    <Input
                      id="soDienThoai"
                      placeholder="0912345678"
                      value={surveyData.lienHe.soDienThoai}
                      onChange={(e) => handleInputChange('lienHe', 'soDienThoai', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (nếu có)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={surveyData.lienHe.email}
                      onChange={(e) => handleInputChange('lienHe', 'email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thanhPho">Thành phố <span className="text-red-500">*</span></Label>
                    <Input
                      id="thanhPho"
                      placeholder="Hà Nội"
                      value={surveyData.lienHe.thanhPho}
                      onChange={(e) => handleInputChange('lienHe', 'thanhPho', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quanHuyen">Quận, Huyện <span className="text-red-500">*</span></Label>
                    <Input
                      id="quanHuyen"
                      placeholder="Cầu Giấy"
                      value={surveyData.lienHe.quanHuyen}
                      onChange={(e) => handleInputChange('lienHe', 'quanHuyen', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phuongXa">Phường, Xã <span className="text-red-500">*</span></Label>
                    <Input
                      id="phuongXa"
                      placeholder="Dịch Vọng"
                      value={surveyData.lienHe.phuongXa}
                      onChange={(e) => handleInputChange('lienHe', 'phuongXa', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="soNhaDuong">Số nhà, đường <span className="text-red-500">*</span></Label>
                    <Input
                      id="soNhaDuong"
                      placeholder="123 Cầu Giấy"
                      value={surveyData.lienHe.soNhaDuong}
                      onChange={(e) => handleInputChange('lienHe', 'soNhaDuong', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin gia đình và học vấn */}
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4 mt-4">Thông tin gia đình và học vấn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soNguoiPhuThuoc">Số người phụ thuộc <span className="text-red-500">*</span></Label>
                    <Input
                      id="soNguoiPhuThuoc"
                      type="number"
                      placeholder="0"
                      value={surveyData.thongTinGiaDinh.soNguoiPhuThuoc}
                      onChange={(e) => handleInputChange('thongTinGiaDinh', 'soNguoiPhuThuoc', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="treEm">Trong đó trẻ em</Label>
                    <Input
                      id="treEm"
                      type="number"
                      placeholder="0"
                      value={surveyData.thongTinGiaDinh.treEm}
                      onChange={(e) => handleInputChange('thongTinGiaDinh', 'treEm', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nguoiLon">Trong đó người lớn</Label>
                    <Input
                      id="nguoiLon"
                      type="number"
                      placeholder="0"
                      value={surveyData.thongTinGiaDinh.nguoiLon}
                      onChange={(e) => handleInputChange('thongTinGiaDinh', 'nguoiLon', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Trình độ học vấn cao nhất <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.hocVan.trinhDoHocVan}
                      onValueChange={(value) => handleInputChange('hocVan', 'trinhDoHocVan', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="duoi-trung-cap">Dưới trung cấp</SelectItem>
                        <SelectItem value="trung-cap">Trung cấp</SelectItem>
                        <SelectItem value="cao-dang">Cao đẳng</SelectItem>
                        <SelectItem value="dai-hoc">Đại học</SelectItem>
                        <SelectItem value="sau-dai-hoc">Sau đại học</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="chuyenNganh">Chuyên ngành (nếu có)</Label>
                    <Input
                      id="chuyenNganh"
                      placeholder="Công nghệ thông tin"
                      value={surveyData.hocVan.chuyenNganh}
                      onChange={(e) => handleInputChange('hocVan', 'chuyenNganh', e.target.value)}
                    />
                  </div>
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
              <CardTitle>Bước 2: Thông tin nghề nghiệp và tài chính</CardTitle>
              <CardDescription>
                Thông tin này giúp chúng tôi đánh giá khả năng trả nợ của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loại hình nghề nghiệp */}
              <div>
                <Label>Loại hình nghề nghiệp <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={surveyData.thongTinNgheNghiep.loaiHinhNgheNghiep}
                  onValueChange={(value) => handleInputChange('thongTinNgheNghiep', 'loaiHinhNgheNghiep', value)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lamCongAnLuong" id="lamCongAnLuong" />
                    <Label htmlFor="lamCongAnLuong">Làm công ăn lương</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tuKinhDoanh" id="tuKinhDoanh" />
                    <Label htmlFor="tuKinhDoanh">Tự kinh doanh</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tuKinhDoanhChungChi" id="tuKinhDoanhChungChi" />
                    <Label htmlFor="tuKinhDoanhChungChi">Tự kinh doanh có chứng chỉ hành nghề</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="khac" id="khacNgheNghiep" />
                    <Label htmlFor="khacNgheNghiep">Khác (Hưu trí, Nội trợ, Sinh viên...)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Làm công ăn lương */}
              {surveyData.thongTinNgheNghiep.loaiHinhNgheNghiep === 'lamCongAnLuong' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin công việc</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenCoQuan">Tên cơ quan công tác <span className="text-red-500">*</span></Label>
                      <Input
                        id="tenCoQuan"
                        placeholder="Công ty ABC"
                        value={surveyData.thongTinNgheNghiep.tenCoQuan}
                        onChange={(e) => handleInputChange('thongTinNgheNghiep', 'tenCoQuan', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Vị trí công việc <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.thongTinNgheNghiep.viTriCongViec}
                        onValueChange={(value) => handleInputChange('thongTinNgheNghiep', 'viTriCongViec', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chuDoanhNghiep">Chủ doanh nghiệp</SelectItem>
                          <SelectItem value="quanLy">Quản lý</SelectItem>
                          <SelectItem value="chuyenVien">Chuyên viên</SelectItem>
                          <SelectItem value="laoDongGianDon">Lao động giản đơn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ngành nghề <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.thongTinNgheNghiep.nganhNghe}
                        onValueChange={(value) => handleInputChange('thongTinNgheNghiep', 'nganhNghe', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="congNgheThongTin">Công nghệ thông tin</SelectItem>
                          <SelectItem value="xayDung">Xây dựng</SelectItem>
                          <SelectItem value="thuongMaiDichVu">Thương mại - Dịch vụ</SelectItem>
                          <SelectItem value="giaoDucDaoTao">Giáo dục - Đào tạo</SelectItem>
                          <SelectItem value="yTe">Y tế</SelectItem>
                          <SelectItem value="nongNghiep">Nông nghiệp</SelectItem>
                          <SelectItem value="sanXuatCongNghiep">Sản xuất - Công nghiệp</SelectItem>
                          <SelectItem value="taiChinhNganHang">Tài chính - Ngân hàng</SelectItem>
                          <SelectItem value="khac">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Loại hợp đồng lao động <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.thongTinNgheNghiep.loaiHopDong}
                        onValueChange={(value) => handleInputChange('thongTinNgheNghiep', 'loaiHopDong', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="khongXacDinhThoiHan">Không xác định thời hạn</SelectItem>
                          <SelectItem value="coXacDinhThoiHan">Có xác định thời hạn</SelectItem>
                          <SelectItem value="thoiVu">Thời vụ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="thoiGianCongTac">Thời gian công tác hiện tại (tháng)</Label>
                      <Input
                        id="thoiGianCongTac"
                        type="number"
                        placeholder="24"
                        value={surveyData.thongTinNgheNghiep.thoiGianCongTac}
                        onChange={(e) => handleInputChange('thongTinNgheNghiep', 'thoiGianCongTac', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hình thức nhận lương <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.thongTinNgheNghiep.hinhThucNhanLuong}
                        onValueChange={(value) => handleInputChange('thongTinNgheNghiep', 'hinhThucNhanLuong', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tienMat">Tiền mặt</SelectItem>
                          <SelectItem value="chuyenKhoan">Chuyển khoản</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {surveyData.thongTinNgheNghiep.hinhThucNhanLuong === 'chuyenKhoan' && (
                      <div className="space-y-2">
                        <Label htmlFor="nganHangNhanLuong">Ngân hàng nhận lương</Label>
                        <Input
                          id="nganHangNhanLuong"
                          placeholder="Vietcombank, Techcombank..."
                          value={surveyData.thongTinNgheNghiep.nganHangNhanLuong}
                          onChange={(e) => handleInputChange('thongTinNgheNghiep', 'nganHangNhanLuong', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tự kinh doanh */}
              {surveyData.thongTinNgheNghiep.loaiHinhNgheNghiep === 'tuKinhDoanh' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin kinh doanh</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenDoanhNghiep">Tên doanh nghiệp/hộ kinh doanh <span className="text-red-500">*</span></Label>
                      <Input
                        id="tenDoanhNghiep"
                        placeholder="Công ty TNHH XYZ"
                        value={surveyData.thongTinNgheNghiep.tenDoanhNghiep}
                        onChange={(e) => handleInputChange('thongTinNgheNghiep', 'tenDoanhNghiep', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ngành nghề kinh doanh <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.thongTinNgheNghiep.nganhNgheKinhDoanh}
                        onValueChange={(value) => handleInputChange('thongTinNgheNghiep', 'nganhNgheKinhDoanh', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="congNgheThongTin">Công nghệ thông tin</SelectItem>
                          <SelectItem value="xayDung">Xây dựng</SelectItem>
                          <SelectItem value="thuongMaiDichVu">Thương mại - Dịch vụ</SelectItem>
                          <SelectItem value="giaoDucDaoTao">Giáo dục - Đào tạo</SelectItem>
                          <SelectItem value="yTe">Y tế</SelectItem>
                          <SelectItem value="nongNghiep">Nông nghiệp</SelectItem>
                          <SelectItem value="sanXuatCongNghiep">Sản xuất - Công nghiệp</SelectItem>
                          <SelectItem value="taiChinhNganHang">Tài chính - Ngân hàng</SelectItem>
                          <SelectItem value="khac">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Loại hình kinh doanh <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.thongTinNgheNghiep.loaiHinhKinhDoanh}
                        onValueChange={(value) => handleInputChange('thongTinNgheNghiep', 'loaiHinhKinhDoanh', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="caNhan">Cá nhân</SelectItem>
                          <SelectItem value="tnhh">TNHH</SelectItem>
                          <SelectItem value="coPhan">Cổ phần</SelectItem>
                          <SelectItem value="hopDanh">Hợp danh</SelectItem>
                          <SelectItem value="hopTacXa">Hợp tác xã</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="thoiGianHoatDong">Thời gian hoạt động (tháng)</Label>
                      <Input
                        id="thoiGianHoatDong"
                        type="number"
                        placeholder="12"
                        value={surveyData.thongTinNgheNghiep.thoiGianHoatDong}
                        onChange={(e) => handleInputChange('thongTinNgheNghiep', 'thoiGianHoatDong', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tự kinh doanh có chứng chỉ */}
              {surveyData.thongTinNgheNghiep.loaiHinhNgheNghiep === 'tuKinhDoanhChungChi' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin nghề có chứng chỉ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nganhNgheChungChi">Ngành nghề cần chứng chỉ <span className="text-red-500">*</span></Label>
                      <Input
                        id="nganhNgheChungChi"
                        placeholder="Bác sĩ, Dược sĩ, Kiểm toán..."
                        value={surveyData.thongTinNgheNghiep.nganhNgheChungChi}
                        onChange={(e) => handleInputChange('thongTinNgheNghiep', 'nganhNgheChungChi', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="thoiGianTrongLinhVuc">Thời gian trong lĩnh vực (tháng)</Label>
                      <Input
                        id="thoiGianTrongLinhVuc"
                        type="number"
                        placeholder="36"
                        value={surveyData.thongTinNgheNghiep.thoiGianTrongLinhVuc}
                        onChange={(e) => handleInputChange('thongTinNgheNghiep', 'thoiGianTrongLinhVuc', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nhóm khác */}
              {surveyData.thongTinNgheNghiep.loaiHinhNgheNghiep === 'khac' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin khác</h3>
                  <div className="space-y-2">
                    <Label htmlFor="nguonThuNhap">Nguồn thu nhập (mô tả ngắn gọn)</Label>
                    <Textarea
                      id="nguonThuNhap"
                      placeholder="Lương hưu, thu nhập từ cho thuê nhà..."
                      value={surveyData.thongTinNgheNghiep.nguonThuNhap}
                      onChange={(e) => handleInputChange('thongTinNgheNghiep', 'nguonThuNhap', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Thu nhập gộp */}
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4 mt-4">Thông tin thu nhập</h3>
                <div className="space-y-2">
                  <Label htmlFor="thuNhapGop">
                    Thu nhập gộp hàng tháng (triệu VND) <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-600">
                    Tổng từ tất cả các nguồn, bao gồm cả vợ/chồng nếu đã kết hôn
                  </p>
                  <Input
                    id="thuNhapGop"
                    type="number"
                    placeholder="20"
                    value={surveyData.thongTinNgheNghiep.thuNhapGop}
                    onChange={(e) => handleInputChange('thongTinNgheNghiep', 'thuNhapGop', e.target.value)}
                  />
                </div>
              </div>

              {/* Khả năng tài chính */}
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4 mt-4">Khả năng tài chính</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chiPhiSinhHoat">
                      Chi phí sinh hoạt hàng tháng (triệu VND) <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-gray-600">
                      Của cả gia đình, bao gồm vợ/chồng nếu đã kết hôn
                    </p>
                    <Input
                      id="chiPhiSinhHoat"
                      type="number"
                      placeholder="8"
                      value={surveyData.khaNangTaiChinh.chiPhiSinhHoat}
                      onChange={(e) => handleInputChange('khaNangTaiChinh', 'chiPhiSinhHoat', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Có khoản vay hoặc nợ đang trả không? <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.khaNangTaiChinh.coKhoanVay}
                      onValueChange={(value) => handleInputChange('khaNangTaiChinh', 'coKhoanVay', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="co">Có</SelectItem>
                        <SelectItem value="khong">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {surveyData.khaNangTaiChinh.coKhoanVay === 'co' && (
                    <div className="space-y-2">
                      <Label htmlFor="soTienTraHangThang">Tổng số tiền trả hàng tháng (triệu VND)</Label>
                      <Input
                        id="soTienTraHangThang"
                        type="number"
                        placeholder="2"
                        value={surveyData.khaNangTaiChinh.soTienTraHangThang}
                        onChange={(e) => handleInputChange('khaNangTaiChinh', 'soTienTraHangThang', e.target.value)}
                      />
                    </div>
                  )}
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
              <CardTitle>Bước 3: Lịch sử tín dụng và mục đích vay</CardTitle>
              <CardDescription>
                Thông tin về lịch sử tín dụng và nhu cầu vay vốn của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lịch sử tín dụng */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Lịch sử tín dụng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Đã từng vay vốn ngân hàng/tổ chức tài chính? <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.lichSuTinDung.daTungVayVon}
                      onValueChange={(value) => handleInputChange('lichSuTinDung', 'daTungVayVon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="co">Có</SelectItem>
                        <SelectItem value="khong">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {surveyData.lichSuTinDung.daTungVayVon === 'co' && (
                    <div className="space-y-2">
                      <Label>Có từng trả nợ trễ hạn không? <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.lichSuTinDung.traNoCham}
                        onValueChange={(value) => handleInputChange('lichSuTinDung', 'traNoCham', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="khongBaoGio">Không bao giờ</SelectItem>
                          <SelectItem value="thinhThoang">Thỉnh thoảng</SelectItem>
                          <SelectItem value="thuongXuyen">Thường xuyên</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Có đang bị nợ chú ý/nợ xấu không? <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.lichSuTinDung.noXau}
                      onValueChange={(value) => handleInputChange('lichSuTinDung', 'noXau', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="co">Có</SelectItem>
                        <SelectItem value="khong">Không</SelectItem>
                        <SelectItem value="khongRo">Không rõ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Mục đích vay */}
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4 mt-4">Mục đích vay</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loại hình vay <span className="text-red-500">*</span></Label>
                    <Select
                      value={surveyData.mucDichVay.loaiHinhVay}
                      onValueChange={(value) => handleInputChange('mucDichVay', 'loaiHinhVay', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theChap">Thế chấp</SelectItem>
                        <SelectItem value="tinChap">Tín chấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="soTienVay">Số tiền muốn vay (triệu VND) <span className="text-red-500">*</span></Label>
                    <Input
                      id="soTienVay"
                      type="number"
                      placeholder="500"
                      value={surveyData.mucDichVay.soTienVay}
                      onChange={(e) => handleInputChange('mucDichVay', 'soTienVay', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Ví dụ: 1000 triệu = 1 tỷ
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mục đích vay <span className="text-red-500">*</span></Label>
                    {surveyData.mucDichVay.loaiHinhVay === 'theChap' ? (
                      <Select
                        value={surveyData.mucDichVay.mucDichCuThe}
                        onValueChange={(value) => handleInputChange('mucDichVay', 'mucDichCuThe', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="muaOTo">Vay mua ô tô (tối đa 7 năm)</SelectItem>
                          <SelectItem value="muaBatDongSan">Vay mua bất động sản (tối đa 30 năm)</SelectItem>
                          <SelectItem value="tieuDung">Vay tiêu dùng (tối đa 15 năm)</SelectItem>
                          <SelectItem value="sanXuatKinhDoanh">Vay sản xuất kinh doanh (tối đa 12 tháng)</SelectItem>
                          <SelectItem value="theTinDung">Thẻ tín dụng (tối đa 60 tháng)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select
                        value={surveyData.mucDichVay.mucDichCuThe}
                        onValueChange={(value) => handleInputChange('mucDichVay', 'mucDichCuThe', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tieuDungThauChi">Vay tiêu dùng / Thấu chi</SelectItem>
                          <SelectItem value="theTinDung">Thẻ tín dụng (tối đa 60 tháng)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thoiGianTraNo">Thời gian trả nợ dự kiến (năm) <span className="text-red-500">*</span></Label>
                    <Input
                      id="thoiGianTraNo"
                      type="number"
                      placeholder="10"
                      value={surveyData.mucDichVay.thoiGianTraNo}
                      onChange={(e) => handleInputChange('mucDichVay', 'thoiGianTraNo', e.target.value)}
                    />
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Vay tiêu dùng: Tối đa 15 năm</p>
                      <p>• Vay mua ô tô: Tối đa 7 năm</p>
                      <p>• Vay sản xuất kinh doanh/thấu chi: Tối đa 12 tháng</p>
                      <p>• Thẻ tín dụng: Tối đa 60 tháng (5 năm)</p>
                      <p>• Các khoản vay khác: Tối đa 30 năm</p>
                      <p>• Tuổi khi kết thúc khoản vay không quá 75 tuổi</p>
                    </div>
                  </div>
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
              <CardTitle>Bước 4: Tài sản bảo đảm và hoàn thành</CardTitle>
              <CardDescription>
                {surveyData.mucDichVay.loaiHinhVay === 'theChap' 
                  ? 'Thông tin về tài sản bảo đảm cho khoản vay thế chấp'
                  : 'Hoàn thành thông tin khảo sát'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {surveyData.mucDichVay.loaiHinhVay === 'theChap' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tài sản bảo đảm</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Có tài sản bảo đảm không? <span className="text-red-500">*</span></Label>
                      <Select
                        value={surveyData.taiSanBaoDam.coTaiSan}
                        onValueChange={(value) => handleInputChange('taiSanBaoDam', 'coTaiSan', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="co">Có</SelectItem>
                          <SelectItem value="khong">Không</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {surveyData.taiSanBaoDam.coTaiSan === 'co' && (
                      <>
                        <div className="space-y-2">
                          <Label>Loại tài sản bảo đảm <span className="text-red-500">*</span></Label>
                          <Select
                            value={surveyData.taiSanBaoDam.loaiTaiSan}
                            onValueChange={(value) => handleInputChange('taiSanBaoDam', 'loaiTaiSan', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="batDongSan">Bất động sản</SelectItem>
                              <SelectItem value="xeOTo">Xe ô tô</SelectItem>
                              <SelectItem value="tienGuiGiayTo">Tiền gửi - Giấy tờ có giá</SelectItem>
                              <SelectItem value="traiPhieu">Trái phiếu</SelectItem>
                              <SelectItem value="khac">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Chi tiết theo loại tài sản */}
                        {surveyData.taiSanBaoDam.loaiTaiSan === 'batDongSan' && (
                          <div className="space-y-4">
                            <Separator />
                            <h4 className="font-semibold">Chi tiết bất động sản</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Loại bất động sản <span className="text-red-500">*</span></Label>
                                <Select
                                  value={surveyData.taiSanBaoDam.loaiBatDongSan}
                                  onValueChange={(value) => handleInputChange('taiSanBaoDam', 'loaiBatDongSan', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="nhaODatO">Nhà ở, đất ở</SelectItem>
                                    <SelectItem value="chungCu">Chung cư</SelectItem>
                                    <SelectItem value="datNenDuAn">Đất nền dự án</SelectItem>
                                    <SelectItem value="datNongNghiep">Đất nông nghiệp</SelectItem>
                                    <SelectItem value="datHonHop">Đất hỗn hợp</SelectItem>
                                    <SelectItem value="batDongSanThuongMai">Bất động sản thương mại</SelectItem>
                                    <SelectItem value="khac">Khác</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Có nhà trên đất không? <span className="text-red-500">*</span></Label>
                                <Select
                                  value={surveyData.taiSanBaoDam.coNhaTrenDat}
                                  onValueChange={(value) => handleInputChange('taiSanBaoDam', 'coNhaTrenDat', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="co">Có</SelectItem>
                                    <SelectItem value="khong">Không</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {surveyData.taiSanBaoDam.coNhaTrenDat === 'co' && (
                                <>
                                  <div className="space-y-2">
                                    <Label htmlFor="dienTichNha">Diện tích nhà (m²) <span className="text-red-500">*</span></Label>
                                    <Input
                                      id="dienTichNha"
                                      type="number"
                                      placeholder="80"
                                      value={surveyData.taiSanBaoDam.dienTichNha}
                                      onChange={(e) => handleInputChange('taiSanBaoDam', 'dienTichNha', e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label>Nhà đã hoàn công chưa? <span className="text-red-500">*</span></Label>
                                    <Select
                                      value={surveyData.taiSanBaoDam.daHoanCong}
                                      onValueChange={(value) => handleInputChange('taiSanBaoDam', 'daHoanCong', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="co">Có</SelectItem>
                                        <SelectItem value="khong">Không</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">
                                      Chỉ ghi nhận giá trị nếu đã hoàn công
                                    </p>
                                  </div>
                                </>
                              )}
                              
                              <div className="space-y-2 md:col-span-2">
                                <Label>Địa chỉ bất động sản <span className="text-red-500">*</span></Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Thành phố"
                                    value={surveyData.taiSanBaoDam.diaChiThanhPho}
                                    onChange={(e) => handleInputChange('taiSanBaoDam', 'diaChiThanhPho', e.target.value)}
                                  />
                                  <Input
                                    placeholder="Quận, Huyện"
                                    value={surveyData.taiSanBaoDam.diaChiQuanHuyen}
                                    onChange={(e) => handleInputChange('taiSanBaoDam', 'diaChiQuanHuyen', e.target.value)}
                                  />
                                  <Input
                                    placeholder="Phường, Xã"
                                    value={surveyData.taiSanBaoDam.diaChiPhuongXa}
                                    onChange={(e) => handleInputChange('taiSanBaoDam', 'diaChiPhuongXa', e.target.value)}
                                  />
                                  <Input
                                    placeholder="Số nhà, đường"
                                    value={surveyData.taiSanBaoDam.diaChiSoNha}
                                    onChange={(e) => handleInputChange('taiSanBaoDam', 'diaChiSoNha', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="soThuaDat">Số thửa đất <span className="text-red-500">*</span></Label>
                                <Input
                                  id="soThuaDat"
                                  placeholder="123"
                                  value={surveyData.taiSanBaoDam.soThuaDat}
                                  onChange={(e) => handleInputChange('taiSanBaoDam', 'soThuaDat', e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="toBanDoSo">Tờ bản đồ số <span className="text-red-500">*</span></Label>
                                <Input
                                  id="toBanDoSo"
                                  placeholder="45"
                                  value={surveyData.taiSanBaoDam.toBanDoSo}
                                  onChange={(e) => handleInputChange('taiSanBaoDam', 'toBanDoSo', e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="dienTichLoDat">Diện tích lô đất (m²) <span className="text-red-500">*</span></Label>
                                <Input
                                  id="dienTichLoDat"
                                  type="number"
                                  placeholder="100"
                                  value={surveyData.taiSanBaoDam.dienTichLoDat}
                                  onChange={(e) => handleInputChange('taiSanBaoDam', 'dienTichLoDat', e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="giaTriUocTinh">Giá trị ước tính (triệu VND) <span className="text-red-500">*</span></Label>
                                <Input
                                  id="giaTriUocTinh"
                                  type="number"
                                  placeholder="2000"
                                  value={surveyData.taiSanBaoDam.giaTriUocTinh}
                                  onChange={(e) => handleInputChange('taiSanBaoDam', 'giaTriUocTinh', e.target.value)}
                                />
                                <p className="text-xs text-gray-500">
                                  Tỷ lệ cấp 70-80% giá trị tài sản
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Tình trạng sở hữu <span className="text-red-500">*</span></Label>
                                <Select
                                  value={surveyData.taiSanBaoDam.tinhTrangSoHuu}
                                  onValueChange={(value) => handleInputChange('taiSanBaoDam', 'tinhTrangSoHuu', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="soHuuHoanToan">Sở hữu hoàn toàn</SelectItem>
                                    <SelectItem value="soHuuCoThoiHan">Sở hữu có thời hạn</SelectItem>
                                    <SelectItem value="dangTraGop">Đang trả góp</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Chủ sở hữu <span className="text-red-500">*</span></Label>
                                <Select
                                  value={surveyData.taiSanBaoDam.chuSoHuu}
                                  onValueChange={(value) => handleInputChange('taiSanBaoDam', 'chuSoHuu', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="soHuuRieng">Sở hữu riêng của tôi</SelectItem>
                                    <SelectItem value="soHuuRiengVoChong">Sở hữu riêng của vợ/chồng tôi</SelectItem>
                                    <SelectItem value="dongSoHuuVoChong">Đồng sở hữu của vợ chồng tôi</SelectItem>
                                    <SelectItem value="baoLanhChaMe">Bảo lãnh từ cha mẹ ruột</SelectItem>
                                    <SelectItem value="baoLanhAnhEm">Bảo lãnh từ anh em ruột</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Mục đích sử dụng <span className="text-red-500">*</span></Label>
                                <Select
                                  value={surveyData.taiSanBaoDam.mucDichSuDung}
                                  onValueChange={(value) => handleInputChange('taiSanBaoDam', 'mucDichSuDung', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="kinhDoanh">Kinh doanh</SelectItem>
                                    <SelectItem value="doiSong">Đời sống</SelectItem>
                                    <SelectItem value="caHai">Cả hai</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Thông tin chung cho tất cả loại tài sản */}
                        <div className="space-y-4">
                          <Separator />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tài sản có đang thế chấp ở nơi khác không? <span className="text-red-500">*</span></Label>
                              <Select
                                value={surveyData.taiSanBaoDam.dangTheChapNoiKhac}
                                onValueChange={(value) => handleInputChange('taiSanBaoDam', 'dangTheChapNoiKhac', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="co">Có</SelectItem>
                                  <SelectItem value="khong">Không</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Sẵn sàng dùng tài sản để bảo đảm khoản vay? <span className="text-red-500">*</span></Label>
                              <Select
                                value={surveyData.taiSanBaoDam.sanSangDungTaiSan}
                                onValueChange={(value) => handleInputChange('taiSanBaoDam', 'sanSangDungTaiSan', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="co">Có</SelectItem>
                                  <SelectItem value="khong">Không</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Nhu cầu khác */}
              <div>
                <Separator />
                <h3 className="text-lg font-semibold mb-4 mt-4">Nhu cầu khác/Ghi chú</h3>
                <div className="space-y-2">
                  <Label htmlFor="nhuCauKhac">Ghi rõ nội dung, mục đích, mong muốn về khoản vay, vấn đề cần hỗ trợ</Label>
                  <Textarea
                    id="nhuCauKhac"
                    placeholder="Mô tả chi tiết về nhu cầu vay vốn, mong muốn về lãi suất, thời gian giải ngân..."
                    rows={4}
                    value={surveyData.nhuCauKhac}
                    onChange={(e) => handleInputChange('', 'nhuCauKhac', e.target.value)}
                  />
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Khảo sát nhu cầu vay vốn chi tiết</h1>
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
            <span>Nghề nghiệp & Tài chính</span>
            <span>Tín dụng & Mục đích vay</span>
            <span>Tài sản & Hoàn thành</span>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </Layout>
  );
};

export default KhaoSat;
