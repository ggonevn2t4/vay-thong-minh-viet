
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface FormData {
  // Thông tin cá nhân
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  tinhTrangHonNhan: string;
  quocTich: string;
  soDienThoai: string; // Added missing phone number field
  
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

const KhaoSat = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    tinhTrangHonNhan: '',
    quocTich: '',
    soDienThoai: '',
    tinhTrangCuTru: '',
    thoiHanConLai: '',
    tinhTrangSoHuuNha: '',
    lyLichTuPhap: '',
    hoTenVoChong: '',
    ngaySinhVoChong: '',
    ngheNghiepVoChong: '',
    thuNhapVoChong: '',
    ngheMana: '',
    viTriCongViec: '',
    thoiGianLamViec: '',
    thuNhapHangThang: '',
    nguonThuNhapKhac: '',
    tongTaiSan: '',
    congNoHienTai: '',
    mucDichVay: '',
    soTienCanVay: '',
    thoiHanVay: '',
    taiSanDamBao: '',
    ghiChuThem: ''
  });

  const totalSteps = 5;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.hoTen && formData.ngaySinh && formData.gioiTinh && formData.soDienThoai;
      case 2:
        return formData.tinhTrangCuTru && formData.tinhTrangSoHuuNha;
      case 3:
        return formData.ngheMana && formData.thuNhapHangThang;
      case 4:
        return formData.mucDichVay && formData.soTienCanVay && formData.thoiHanVay;
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hoTen">Họ và tên *</Label>
                <Input
                  id="hoTen"
                  value={formData.hoTen}
                  onChange={(e) => updateFormData('hoTen', e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>
              
              <div>
                <Label htmlFor="ngaySinh">Ngày sinh *</Label>
                <Input
                  id="ngaySinh"
                  type="date"
                  value={formData.ngaySinh}
                  onChange={(e) => updateFormData('ngaySinh', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Giới tính *</Label>
                <Select value={formData.gioiTinh} onValueChange={(value) => updateFormData('gioiTinh', value)}>
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
                  value={formData.soDienThoai}
                  onChange={(e) => updateFormData('soDienThoai', e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tình trạng hôn nhân</Label>
                <Select value={formData.tinhTrangHonNhan} onValueChange={(value) => updateFormData('tinhTrangHonNhan', value)}>
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
                <Select value={formData.quocTich} onValueChange={(value) => updateFormData('quocTich', value)}>
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

            {formData.tinhTrangHonNhan === 'ket-hon' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Thông tin vợ/chồng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hoTenVoChong">Họ và tên vợ/chồng</Label>
                    <Input
                      id="hoTenVoChong"
                      value={formData.hoTenVoChong}
                      onChange={(e) => updateFormData('hoTenVoChong', e.target.value)}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ngaySinhVoChong">Ngày sinh</Label>
                    <Input
                      id="ngaySinhVoChong"
                      type="date"
                      value={formData.ngaySinhVoChong}
                      onChange={(e) => updateFormData('ngaySinhVoChong', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ngheNghiepVoChong">Nghề nghiệp</Label>
                    <Input
                      id="ngheNghiepVoChong"
                      value={formData.ngheNghiepVoChong}
                      onChange={(e) => updateFormData('ngheNghiepVoChong', e.target.value)}
                      placeholder="Nhập nghề nghiệp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="thuNhapVoChong">Thu nhập hàng tháng</Label>
                    <Input
                      id="thuNhapVoChong"
                      value={formData.thuNhapVoChong}
                      onChange={(e) => updateFormData('thuNhapVoChong', e.target.value)}
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
                value={formData.tinhTrangCuTru} 
                onValueChange={(value) => updateFormData('tinhTrangCuTru', value)}
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

            {formData.tinhTrangCuTru === 'tam-tru' && (
              <div>
                <Label>Thời hạn còn lại</Label>
                <Select value={formData.thoiHanConLai} onValueChange={(value) => updateFormData('thoiHanConLai', value)}>
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
                value={formData.tinhTrangSoHuuNha} 
                onValueChange={(value) => updateFormData('tinhTrangSoHuuNha', value)}
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
                value={formData.lyLichTuPhap} 
                onValueChange={(value) => updateFormData('lyLichTuPhap', value)}
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
                  value={formData.ngheMana}
                  onChange={(e) => updateFormData('ngheMana', e.target.value)}
                  placeholder="Nhập nghề nghiệp"
                />
              </div>
              
              <div>
                <Label htmlFor="viTriCongViec">Vị trí công việc</Label>
                <Input
                  id="viTriCongViec"
                  value={formData.viTriCongViec}
                  onChange={(e) => updateFormData('viTriCongViec', e.target.value)}
                  placeholder="Nhập vị trí công việc"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Thời gian làm việc hiện tại</Label>
                <Select value={formData.thoiGianLamViec} onValueChange={(value) => updateFormData('thoiGianLamViec', value)}>
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
                  value={formData.thuNhapHangThang}
                  onChange={(e) => updateFormData('thuNhapHangThang', e.target.value)}
                  placeholder="Nhập thu nhập (VNĐ)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nguonThuNhapKhac">Nguồn thu nhập khác</Label>
              <Textarea
                id="nguonThuNhapKhac"
                value={formData.nguonThuNhapKhac}
                onChange={(e) => updateFormData('nguonThuNhapKhac', e.target.value)}
                placeholder="Mô tả các nguồn thu nhập khác (nếu có)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tongTaiSan">Tổng tài sản ước tính</Label>
                <Input
                  id="tongTaiSan"
                  value={formData.tongTaiSan}
                  onChange={(e) => updateFormData('tongTaiSan', e.target.value)}
                  placeholder="Nhập tổng tài sản (VNĐ)"
                />
              </div>
              
              <div>
                <Label htmlFor="congNoHienTai">Công nợ hiện tại</Label>
                <Input
                  id="congNoHienTai"
                  value={formData.congNoHienTai}
                  onChange={(e) => updateFormData('congNoHienTai', e.target.value)}
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
              <Select value={formData.mucDichVay} onValueChange={(value) => updateFormData('mucDichVay', value)}>
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
                  value={formData.soTienCanVay}
                  onChange={(e) => updateFormData('soTienCanVay', e.target.value)}
                  placeholder="Nhập số tiền (VNĐ)"
                />
              </div>
              
              <div>
                <Label>Thời hạn vay *</Label>
                <Select value={formData.thoiHanVay} onValueChange={(value) => updateFormData('thoiHanVay', value)}>
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
                value={formData.taiSanDamBao}
                onChange={(e) => updateFormData('taiSanDamBao', e.target.value)}
                placeholder="Mô tả tài sản đảm bảo (nếu có)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ghiChuThem">Ghi chú thêm</Label>
              <Textarea
                id="ghiChuThem"
                value={formData.ghiChuThem}
                onChange={(e) => updateFormData('ghiChuThem', e.target.value)}
                placeholder="Thông tin bổ sung khác"
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <CheckCircle className="mr-2 text-green-500" />
              Xem lại thông tin
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Thông tin cá nhân</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Họ tên: {formData.hoTen}</div>
                  <div>Ngày sinh: {formData.ngaySinh}</div>
                  <div>Giới tính: {formData.gioiTinh}</div>
                  <div>Số điện thoại: {formData.soDienThoai}</div>
                  <div>Tình trạng hôn nhân: {formData.tinhTrangHonNhan}</div>
                  <div>Quốc tịch: {formData.quocTich}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Thông tin cư trú</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Tình trạng cư trú: {formData.tinhTrangCuTru}</div>
                  <div>Sở hữu nhà: {formData.tinhTrangSoHuuNha}</div>
                  <div>Lý lịch tư pháp: {formData.lyLichTuPhap}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Thông tin tài chính</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Nghề nghiệp: {formData.ngheMana}</div>
                  <div>Thu nhập: {formData.thuNhapHangThang}</div>
                  <div>Thời gian làm việc: {formData.thoiGianLamViec}</div>
                  <div>Tổng tài sản: {formData.tongTaiSan}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Mục đích vay</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Mục đích: {formData.mucDichVay}</div>
                  <div>Số tiền: {formData.soTienCanVay}</div>
                  <div>Thời hạn: {formData.thoiHanVay}</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Khảo sát thông tin vay vốn
                </CardTitle>
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {[...Array(totalSteps)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index + 1 === currentStep
                            ? 'bg-blue-500 text-white'
                            : index + 1 < currentStep
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
                  Bước {currentStep} / {totalSteps}
                </div>
              </CardHeader>
              
              <CardContent>
                {renderStep()}
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Quay lại
                  </Button>
                  
                  {currentStep === totalSteps ? (
                    <Button
                      onClick={handleSubmit}
                      className="flex items-center bg-green-500 hover:bg-green-600"
                    >
                      Hoàn thành
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className="flex items-center"
                    >
                      Tiếp theo
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KhaoSat;
