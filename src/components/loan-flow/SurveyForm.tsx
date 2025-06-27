
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SurveyFormData {
  // Thông tin cá nhân
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  tinhTrangHonNhan: string;
  quocTich: string;
  soDienThoai: string;
  
  // Thông tin cư trú
  tinhTrangCuTru: string;
  thoiHanConLai: string;
  tinhTrangSoHuuNha: string;
  
  // Lý lịch tư pháp
  lyLichTuPhap: string;
  
  // Thông tin vợ/chồng (nếu có)
  hoTenVoChong: string;
  ngaySinhVoChong: string;
  ngheNghiepVoChong: string;
  thuNhapVoChong: string;
  
  // Thông tin tài chính
  ngheMana: string;
  viTriCongViec: string;
  thoiGianLamViec: string;
  thuNhapHangThang: string;
  nguonThuNhapKhac: string;
  tongTaiSan: string;
  congNoHienTai: string;
  
  // Mục đích vay
  mucDichVay: string;
  soTienCanVay: string;
  thoiHanVay: string;
  taiSanDamBao: string;
  ghiChuThem: string;
}

interface SurveyFormProps {
  formData: Record<string, any>;
  onUpdateFormData: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SurveyForm = ({ formData, onUpdateFormData, onNext, onBack }: SurveyFormProps) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const totalSubSteps = 4;

  const surveyData: SurveyFormData = {
    hoTen: formData.hoTen || '',
    ngaySinh: formData.ngaySinh || '',
    gioiTinh: formData.gioiTinh || '',
    tinhTrangHonNhan: formData.tinhTrangHonNhan || '',
    quocTich: formData.quocTich || '',
    soDienThoai: formData.soDienThoai || '',
    tinhTrangCuTru: formData.tinhTrangCuTru || '',
    thoiHanConLai: formData.thoiHanConLai || '',
    tinhTrangSoHuuNha: formData.tinhTrangSoHuuNha || '',
    lyLichTuPhap: formData.lyLichTuPhap || '',
    hoTenVoChong: formData.hoTenVoChong || '',
    ngaySinhVoChong: formData.ngaySinhVoChong || '',
    ngheNghiepVoChong: formData.ngheNghiepVoChong || '',
    thuNhapVoChong: formData.thuNhapVoChong || '',
    ngheMana: formData.ngheMana || '',
    viTriCongViec: formData.viTriCongViec || '',
    thoiGianLamViec: formData.thoiGianLamViec || '',
    thuNhapHangThang: formData.thuNhapHangThang || '',
    nguonThuNhapKhac: formData.nguonThuNhapKhac || '',
    tongTaiSan: formData.tongTaiSan || '',
    congNoHienTai: formData.congNoHienTai || '',
    mucDichVay: formData.mucDichVay || '',
    soTienCanVay: formData.soTienCanVay || '',
    thoiHanVay: formData.thoiHanVay || '',
    taiSanDamBao: formData.taiSanDamBao || '',
    ghiChuThem: formData.ghiChuThem || ''
  };

  const updateSurveyData = (field: keyof SurveyFormData, value: string) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    onUpdateFormData(updatedData);
  };

  const nextSubStep = () => {
    if (currentSubStep < totalSubSteps) {
      setCurrentSubStep(currentSubStep + 1);
    } else {
      onNext();
    }
  };

  const prevSubStep = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(currentSubStep - 1);
    } else {
      onBack();
    }
  };

  const isSubStepValid = (step: number) => {
    switch (step) {
      case 1:
        return surveyData.hoTen && surveyData.ngaySinh && surveyData.gioiTinh && surveyData.soDienThoai;
      case 2:
        return surveyData.tinhTrangCuTru && surveyData.tinhTrangSoHuuNha;
      case 3:
        return surveyData.ngheMana && surveyData.thuNhapHangThang;
      case 4:
        return surveyData.mucDichVay && surveyData.soTienCanVay && surveyData.thoiHanVay;
      default:
        return false;
    }
  };

  const renderSubStep = () => {
    switch (currentSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hoTen">Họ và tên *</Label>
                <Input
                  id="hoTen"
                  value={surveyData.hoTen}
                  onChange={(e) => updateSurveyData('hoTen', e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>
              
              <div>
                <Label htmlFor="ngaySinh">Ngày sinh *</Label>
                <Input
                  id="ngaySinh"
                  type="date"
                  value={surveyData.ngaySinh}
                  onChange={(e) => updateSurveyData('ngaySinh', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Giới tính *</Label>
                <Select value={surveyData.gioiTinh} onValueChange={(value) => updateSurveyData('gioiTinh', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nam">Nam</SelectItem>
                    <SelectItem value="nu">Nữ</SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="soDienThoai">Số điện thoại *</Label>
                <Input
                  id="soDienThoai"
                  value={surveyData.soDienThoai}
                  onChange={(e) => updateSurveyData('soDienThoai', e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tình trạng hôn nhân</Label>
                <Select value={surveyData.tinhTrangHonNhan} onValueChange={(value) => updateSurveyData('tinhTrangHonNhan', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doc-than">Độc thân</SelectItem>
                    <SelectItem value="ket-hon">Kết hôn</SelectItem>
                    <SelectItem value="ly-hon">Ly hôn</SelectItem>
                    <SelectItem value="goa">Góa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Quốc tịch</Label>
                <Select value={surveyData.quocTich} onValueChange={(value) => updateSurveyData('quocTich', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quốc tịch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viet-nam">Việt Nam</SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {surveyData.tinhTrangHonNhan === 'ket-hon' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Thông tin vợ/chồng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hoTenVoChong">Họ và tên vợ/chồng</Label>
                    <Input
                      id="hoTenVoChong"
                      value={surveyData.hoTenVoChong}
                      onChange={(e) => updateSurveyData('hoTenVoChong', e.target.value)}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ngaySinhVoChong">Ngày sinh</Label>
                    <Input
                      id="ngaySinhVoChong"
                      type="date"
                      value={surveyData.ngaySinhVoChong}
                      onChange={(e) => updateSurveyData('ngaySinhVoChong', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ngheNghiepVoChong">Nghề nghiệp</Label>
                    <Input
                      id="ngheNghiepVoChong"
                      value={surveyData.ngheNghiepVoChong}
                      onChange={(e) => updateSurveyData('ngheNghiepVoChong', e.target.value)}
                      placeholder="Nhập nghề nghiệp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="thuNhapVoChong">Thu nhập hàng tháng</Label>
                    <Input
                      id="thuNhapVoChong"
                      value={surveyData.thuNhapVoChong}
                      onChange={(e) => updateSurveyData('thuNhapVoChong', e.target.value)}
                      placeholder="Nhập thu nhập"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin cư trú</h3>
            
            <div>
              <Label>Tình trạng cư trú *</Label>
              <RadioGroup 
                value={surveyData.tinhTrangCuTru} 
                onValueChange={(value) => updateSurveyData('tinhTrangCuTru', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="thuong-tru" id="thuong-tru" />
                  <Label htmlFor="thuong-tru">Thường trú</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tam-tru" id="tam-tru" />
                  <Label htmlFor="tam-tru">Tạm trú</Label>
                </div>
              </RadioGroup>
            </div>

            {surveyData.tinhTrangCuTru === 'tam-tru' && (
              <div>
                <Label>Thời hạn còn lại</Label>
                <Select value={surveyData.thoiHanConLai} onValueChange={(value) => updateSurveyData('thoiHanConLai', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời hạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duoi-6-thang">Dưới 6 tháng</SelectItem>
                    <SelectItem value="6-12-thang">6-12 tháng</SelectItem>
                    <SelectItem value="tren-1-nam">Trên 1 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Tình trạng sở hữu nhà *</Label>
              <RadioGroup 
                value={surveyData.tinhTrangSoHuuNha} 
                onValueChange={(value) => updateSurveyData('tinhTrangSoHuuNha', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="so-huu" id="so-huu" />
                  <Label htmlFor="so-huu">Sở hữu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="thue" id="thue" />
                  <Label htmlFor="thue">Thuê</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="o-nha-bo-me" id="o-nha-bo-me" />
                  <Label htmlFor="o-nha-bo-me">Ở nhà bố mẹ/người thân</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="khac" id="khac-nha" />
                  <Label htmlFor="khac-nha">Khác</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Lý lịch tư pháp</Label>
              <RadioGroup 
                value={surveyData.lyLichTuPhap} 
                onValueChange={(value) => updateSurveyData('lyLichTuPhap', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sach" id="sach" />
                  <Label htmlFor="sach">Sạch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="co-tien-an" id="co-tien-an" />
                  <Label htmlFor="co-tien-an">Có tiền án</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin tài chính</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ngheMana">Nghề nghiệp *</Label>
                <Input
                  id="ngheMana"
                  value={surveyData.ngheMana}
                  onChange={(e) => updateSurveyData('ngheMana', e.target.value)}
                  placeholder="Nhập nghề nghiệp"
                />
              </div>
              
              <div>
                <Label htmlFor="viTriCongViec">Vị trí công việc</Label>
                <Input
                  id="viTriCongViec"
                  value={surveyData.viTriCongViec}
                  onChange={(e) => updateSurveyData('viTriCongViec', e.target.value)}
                  placeholder="Nhập vị trí công việc"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Thời gian làm việc hiện tại</Label>
                <Select value={surveyData.thoiGianLamViec} onValueChange={(value) => updateSurveyData('thoiGianLamViec', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duoi-1-nam">Dưới 1 năm</SelectItem>
                    <SelectItem value="1-3-nam">1-3 năm</SelectItem>
                    <SelectItem value="3-5-nam">3-5 năm</SelectItem>
                    <SelectItem value="tren-5-nam">Trên 5 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="thuNhapHangThang">Thu nhập hàng tháng *</Label>
                <Input
                  id="thuNhapHangThang"
                  value={surveyData.thuNhapHangThang}
                  onChange={(e) => updateSurveyData('thuNhapHangThang', e.target.value)}
                  placeholder="Nhập thu nhập (VNĐ)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nguonThuNhapKhac">Nguồn thu nhập khác</Label>
              <Textarea
                id="nguonThuNhapKhac"
                value={surveyData.nguonThuNhapKhac}
                onChange={(e) => updateSurveyData('nguonThuNhapKhac', e.target.value)}
                placeholder="Mô tả các nguồn thu nhập khác (nếu có)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tongTaiSan">Tổng tài sản ước tính</Label>
                <Input
                  id="tongTaiSan"
                  value={surveyData.tongTaiSan}
                  onChange={(e) => updateSurveyData('tongTaiSan', e.target.value)}
                  placeholder="Nhập tổng tài sản (VNĐ)"
                />
              </div>
              
              <div>
                <Label htmlFor="congNoHienTai">Công nợ hiện tại</Label>
                <Input
                  id="congNoHienTai"
                  value={surveyData.congNoHienTai}
                  onChange={(e) => updateSurveyData('congNoHienTai', e.target.value)}
                  placeholder="Nhập tổng công nợ (VNĐ)"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Mục đích vay</h3>
            
            <div>
              <Label>Mục đích vay *</Label>
              <Select value={surveyData.mucDichVay} onValueChange={(value) => updateSurveyData('mucDichVay', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mục đích vay" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mua-nha">Mua nhà</SelectItem>
                  <SelectItem value="sua-nha">Sửa chữa nhà</SelectItem>
                  <SelectItem value="kinh-doanh">Kinh doanh</SelectItem>
                  <SelectItem value="tieu-dung">Tiêu dùng</SelectItem>
                  <SelectItem value="giao-duc">Giáo dục</SelectItem>
                  <SelectItem value="y-te">Y tế</SelectItem>
                  <SelectItem value="khac">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="soTienCanVay">Số tiền cần vay *</Label>
                <Input
                  id="soTienCanVay"
                  value={surveyData.soTienCanVay}
                  onChange={(e) => updateSurveyData('soTienCanVay', e.target.value)}
                  placeholder="Nhập số tiền (VNĐ)"
                />
              </div>
              
              <div>
                <Label>Thời hạn vay *</Label>
                <Select value={surveyData.thoiHanVay} onValueChange={(value) => updateSurveyData('thoiHanVay', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời hạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duoi-1-nam">Dưới 1 năm</SelectItem>
                    <SelectItem value="1-3-nam">1-3 năm</SelectItem>
                    <SelectItem value="3-5-nam">3-5 năm</SelectItem>
                    <SelectItem value="5-10-nam">5-10 năm</SelectItem>
                    <SelectItem value="10-20-nam">10-20 năm</SelectItem>
                    <SelectItem value="tren-20-nam">Trên 20 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="taiSanDamBao">Tài sản đảm bảo</Label>
              <Textarea
                id="taiSanDamBao"
                value={surveyData.taiSanDamBao}
                onChange={(e) => updateSurveyData('taiSanDamBao', e.target.value)}
                placeholder="Mô tả tài sản đảm bảo (nếu có)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ghiChuThem">Ghi chú thêm</Label>
              <Textarea
                id="ghiChuThem"
                value={surveyData.ghiChuThem}
                onChange={(e) => updateSurveyData('ghiChuThem', e.target.value)}
                placeholder="Thông tin bổ sung khác"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Khảo sát thông tin vay vốn
          </CardTitle>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[...Array(totalSubSteps)].map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 === currentSubStep
                      ? 'bg-blue-500 text-white'
                      : index + 1 < currentSubStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            Bước {currentSubStep} / {totalSubSteps}
          </div>
        </CardHeader>
        
        <CardContent>
          {renderSubStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevSubStep}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            
            <Button
              onClick={nextSubStep}
              disabled={!isSubStepValid(currentSubStep)}
              className="flex items-center"
            >
              {currentSubStep === totalSubSteps ? 'Hoàn thành' : 'Tiếp theo'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyForm;
