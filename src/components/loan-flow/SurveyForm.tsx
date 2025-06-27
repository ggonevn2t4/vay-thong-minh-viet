
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
  // Thông tin cơ bản thẻ tín dụng
  hanMucMongMuon: string;
  loaiTheMongMuon: string;
  
  // Thông tin cá nhân
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  tinhTrangHonNhan: string;
  tinhTrangSoHuuNha: string;
  quocTich: string;
  trinhDoHocVan: string;
  soNguoiPhuThuoc: string;
  soTreEm: string;
  soNguoiLon: string;
  soDienThoai: string;
  
  // Thông tin nghề nghiệp
  loaiHinhNgheNghiep: string;
  
  // Làm công ăn lương
  tenCoQuan: string;
  diaChiCoQuan: string;
  viTriCongViec: string;
  nganhNghe: string;
  loaiHopDong: string;
  thoiHanHopDong: string;
  thoiGianConLaiHopDong: string;
  thoiGianCongTacTaiDonVi: string;
  thoiGianCongTacTrongLinhVuc: string;
  hinhThucNhanLuong: string;
  nganhangNhanLuong: string;
  
  // Tự kinh doanh
  tenDoanhNghiep: string;
  maSoThue: string;
  nganhNgheKinhDoanh: string;
  loaiHinhKinhDoanh: string;
  thoiGianKinhDoanh: string;
  
  // Cho thuê
  loaiChoThue: string[];
  thoiGianChoThue: string;
  
  // Thông tin tài chính
  tongThuNhapGop: string;
  coSuDungTheTinDung: string;
  thongTinTheTinDung: {
    nganhangPhatHanh: string;
    loaiThe: string;
    hanMucTinDung: string;
    soTienTraHangThang: string;
  };
  coVayCaNhan: string;
  thongTinVayCaNhan: {
    tenNganHang: string;
    thoiHanVay: string;
    hinhThucVay: string;
    soTienTraHangThang: string;
  };
  
  // Yêu cầu bổ sung
  yeuCauBoSung: string;
}

interface SurveyFormProps {
  formData: Record<string, any>;
  onUpdateFormData: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SurveyForm = ({ formData, onUpdateFormData, onNext, onBack }: SurveyFormProps) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const totalSubSteps = 6;

  const surveyData: SurveyFormData = {
    hanMucMongMuon: formData.hanMucMongMuon || '',
    loaiTheMongMuon: formData.loaiTheMongMuon || '',
    hoTen: formData.hoTen || '',
    ngaySinh: formData.ngaySinh || '',
    gioiTinh: formData.gioiTinh || '',
    tinhTrangHonNhan: formData.tinhTrangHonNhan || '',
    tinhTrangSoHuuNha: formData.tinhTrangSoHuuNha || '',
    quocTich: formData.quocTich || '',
    trinhDoHocVan: formData.trinhDoHocVan || '',
    soNguoiPhuThuoc: formData.soNguoiPhuThuoc || '',
    soTreEm: formData.soTreEm || '',
    soNguoiLon: formData.soNguoiLon || '',
    soDienThoai: formData.soDienThoai || '',
    loaiHinhNgheNghiep: formData.loaiHinhNgheNghiep || '',
    tenCoQuan: formData.tenCoQuan || '',
    diaChiCoQuan: formData.diaChiCoQuan || '',
    viTriCongViec: formData.viTriCongViec || '',
    nganhNghe: formData.nganhNghe || '',
    loaiHopDong: formData.loaiHopDong || '',
    thoiHanHopDong: formData.thoiHanHopDong || '',
    thoiGianConLaiHopDong: formData.thoiGianConLaiHopDong || '',
    thoiGianCongTacTaiDonVi: formData.thoiGianCongTacTaiDonVi || '',
    thoiGianCongTacTrongLinhVuc: formData.thoiGianCongTacTrongLinhVuc || '',
    hinhThucNhanLuong: formData.hinhThucNhanLuong || '',
    nganhangNhanLuong: formData.nganhangNhanLuong || '',
    tenDoanhNghiep: formData.tenDoanhNghiep || '',
    maSoThue: formData.maSoThue || '',
    nganhNgheKinhDoanh: formData.nganhNgheKinhDoanh || '',
    loaiHinhKinhDoanh: formData.loaiHinhKinhDoanh || '',
    thoiGianKinhDoanh: formData.thoiGianKinhDoanh || '',
    loaiChoThue: formData.loaiChoThue || [],
    thoiGianChoThue: formData.thoiGianChoThue || '',
    tongThuNhapGop: formData.tongThuNhapGop || '',
    coSuDungTheTinDung: formData.coSuDungTheTinDung || '',
    thongTinTheTinDung: formData.thongTinTheTinDung || {
      nganhangPhatHanh: '',
      loaiThe: '',
      hanMucTinDung: '',
      soTienTraHangThang: ''
    },
    coVayCaNhan: formData.coVayCaNhan || '',
    thongTinVayCaNhan: formData.thongTinVayCaNhan || {
      tenNganHang: '',
      thoiHanVay: '',
      hinhThucVay: '',
      soTienTraHangThang: ''
    },
    yeuCauBoSung: formData.yeuCauBoSung || ''
  };

  const updateSurveyData = (field: string, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    onUpdateFormData(updatedData);
  };

  const updateNestedData = (parentField: string, childField: string, value: string) => {
    const currentParentData = formData[parentField] || {};
    const updatedParentData = {
      ...currentParentData,
      [childField]: value
    };
    updateSurveyData(parentField, updatedParentData);
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
        return surveyData.hanMucMongMuon && surveyData.loaiTheMongMuon;
      case 2:
        return surveyData.hoTen && surveyData.ngaySinh && surveyData.gioiTinh && surveyData.soDienThoai && 
               surveyData.tinhTrangHonNhan && surveyData.tinhTrangSoHuuNha && surveyData.quocTich && 
               surveyData.trinhDoHocVan && surveyData.soNguoiPhuThuoc;
      case 3:
        return surveyData.loaiHinhNgheNghiep;
      case 4:
        if (surveyData.loaiHinhNgheNghiep === 'lam-cong-an-luong') {
          return surveyData.tenCoQuan && surveyData.diaChiCoQuan && surveyData.viTriCongViec && 
                 surveyData.nganhNghe && surveyData.loaiHopDong && surveyData.hinhThucNhanLuong;
        } else if (surveyData.loaiHinhNgheNghiep === 'tu-kinh-doanh') {
          return surveyData.tenDoanhNghiep && surveyData.maSoThue && surveyData.nganhNgheKinhDoanh && 
                 surveyData.loaiHinhKinhDoanh;
        }
        return true;
      case 5:
        return surveyData.tongThuNhapGop && surveyData.coSuDungTheTinDung && surveyData.coVayCaNhan;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const renderSubStep = () => {
    switch (currentSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin thẻ tín dụng</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hanMucMongMuon">Hạn mức thẻ mong muốn * (triệu VNĐ)</Label>
                <Input
                  id="hanMucMongMuon"
                  type="number"
                  max="500"
                  value={surveyData.hanMucMongMuon}
                  onChange={(e) => updateSurveyData('hanMucMongMuon', e.target.value)}
                  placeholder="Nhập hạn mức (tối đa 500 triệu)"
                />
                <p className="text-xs text-gray-500 mt-1">Tín chấp tối đa 500 triệu VNĐ</p>
              </div>
              
              <div>
                <Label>Loại thẻ mong muốn phát hành *</Label>
                <Select value={surveyData.loaiTheMongMuon} onValueChange={(value) => updateSurveyData('loaiTheMongMuon', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại thẻ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="jcb">JCB</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin cá nhân bổ sung</h3>
            
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
                <Label>Tình trạng hôn nhân hiện tại *</Label>
                <Select value={surveyData.tinhTrangHonNhan} onValueChange={(value) => updateSurveyData('tinhTrangHonNhan', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doc-than">Độc thân</SelectItem>
                    <SelectItem value="da-ket-hon">Đã kết hôn</SelectItem>
                    <SelectItem value="da-ly-hon">Đã ly hôn</SelectItem>
                    <SelectItem value="goa">Góa</SelectItem>
                    <SelectItem value="ly-than">Ly thân</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tình trạng sở hữu nhà *</Label>
                <Select value={surveyData.tinhTrangSoHuuNha} onValueChange={(value) => updateSurveyData('tinhTrangSoHuuNha', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="khong">Không</SelectItem>
                    <SelectItem value="so-huu">Sở hữu</SelectItem>
                    <SelectItem value="so-huu-tra-gop">Sở hữu và trả góp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Quốc tịch *</Label>
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
              
              <div>
                <Label>Trình độ học vấn cao nhất *</Label>
                <Select value={surveyData.trinhDoHocVan} onValueChange={(value) => updateSurveyData('trinhDoHocVan', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trình độ" />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="soNguoiPhuThuoc">Số người phụ thuộc *</Label>
                <Input
                  id="soNguoiPhuThuoc"
                  type="number"
                  min="0"
                  value={surveyData.soNguoiPhuThuoc}
                  onChange={(e) => updateSurveyData('soNguoiPhuThuoc', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="soTreEm">Trong đó: Trẻ em</Label>
                <Input
                  id="soTreEm"
                  type="number"
                  min="0"
                  value={surveyData.soTreEm}
                  onChange={(e) => updateSurveyData('soTreEm', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="soNguoiLon">Người lớn</Label>
                <Input
                  id="soNguoiLon"
                  type="number"
                  min="0"
                  value={surveyData.soNguoiLon}
                  onChange={(e) => updateSurveyData('soNguoiLon', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin nghề nghiệp</h3>
            
            <div>
              <Label>Loại hình nghề nghiệp chính *</Label>
              <RadioGroup 
                value={surveyData.loaiHinhNgheNghiep} 
                onValueChange={(value) => updateSurveyData('loaiHinhNgheNghiep', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lam-cong-an-luong" id="lam-cong-an-luong" />
                  <Label htmlFor="lam-cong-an-luong">Làm công ăn lương</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tu-kinh-doanh" id="tu-kinh-doanh" />
                  <Label htmlFor="tu-kinh-doanh">Tự kinh doanh</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cho-thue" id="cho-thue" />
                  <Label htmlFor="cho-thue">Cho thuê</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="khac" id="khac-nghe" />
                  <Label htmlFor="khac-nghe">Khác (Hưu trí, Nội trợ, Sinh viên, Lao động tự do, v.v.)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Chi tiết nghề nghiệp</h3>
            
            {surveyData.loaiHinhNgheNghiep === 'lam-cong-an-luong' && (
              <div className="space-y-4">
                <h4 className="font-medium">Thông tin làm công ăn lương</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenCoQuan">Tên cơ quan công tác *</Label>
                    <Input
                      id="tenCoQuan"
                      value={surveyData.tenCoQuan}
                      onChange={(e) => updateSurveyData('tenCoQuan', e.target.value)}
                      placeholder="Nhập tên cơ quan"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="diaChiCoQuan">Địa chỉ cơ quan công tác *</Label>
                    <Input
                      id="diaChiCoQuan"
                      value={surveyData.diaChiCoQuan}
                      onChange={(e) => updateSurveyData('diaChiCoQuan', e.target.value)}
                      placeholder="Nhập địa chỉ cơ quan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Vị trí công việc *</Label>
                    <Select value={surveyData.viTriCongViec} onValueChange={(value) => updateSurveyData('viTriCongViec', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chu-doanh-nghiep">Chủ doanh nghiệp</SelectItem>
                        <SelectItem value="quan-ly">Quản lý</SelectItem>
                        <SelectItem value="chuyen-vien">Chuyên viên</SelectItem>
                        <SelectItem value="lao-dong-gian-don">Lao động giản đơn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Ngành nghề *</Label>
                    <Select value={surveyData.nganhNghe} onValueChange={(value) => updateSurveyData('nganhNghe', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngành nghề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cong-nghe-thong-tin">Công nghệ thông tin</SelectItem>
                        <SelectItem value="xay-dung">Xây dựng</SelectItem>
                        <SelectItem value="thuong-mai-dich-vu">Thương mại - Dịch vụ</SelectItem>
                        <SelectItem value="giao-duc-dao-tao">Giáo dục - Đào tạo</SelectItem>
                        <SelectItem value="y-te">Y tế</SelectItem>
                        <SelectItem value="nong-nghiep">Nông nghiệp</SelectItem>
                        <SelectItem value="san-xuat-cong-nghiep">Sản xuất - Công nghiệp</SelectItem>
                        <SelectItem value="tai-chinh-ngan-hang">Tài chính - Ngân hàng</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Loại hợp đồng lao động *</Label>
                  <Select value={surveyData.loaiHopDong} onValueChange={(value) => updateSurveyData('loaiHopDong', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hợp đồng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="khong-xac-dinh-thoi-han">Không xác định thời hạn</SelectItem>
                      <SelectItem value="co-xac-dinh-thoi-han">Có xác định thời hạn</SelectItem>
                      <SelectItem value="thoi-vu-hoac-khong-co">Thời vụ hoặc Không có HĐLĐ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {surveyData.loaiHopDong === 'co-xac-dinh-thoi-han' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="thoiHanHopDong">Thời hạn hợp đồng (tháng)</Label>
                      <Input
                        id="thoiHanHopDong"
                        type="number"
                        value={surveyData.thoiHanHopDong}
                        onChange={(e) => updateSurveyData('thoiHanHopDong', e.target.value)}
                        placeholder="Nhập số tháng"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="thoiGianConLaiHopDong">Thời gian còn lại (tháng)</Label>
                      <Input
                        id="thoiGianConLaiHopDong"
                        type="number"
                        value={surveyData.thoiGianConLaiHopDong}
                        onChange={(e) => updateSurveyData('thoiGianConLaiHopDong', e.target.value)}
                        placeholder="Nhập số tháng"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="thoiGianCongTacTaiDonVi">Thời gian công tác tại đơn vị hiện tại (tháng)</Label>
                    <Input
                      id="thoiGianCongTacTaiDonVi"
                      type="number"
                      value={surveyData.thoiGianCongTacTaiDonVi}
                      onChange={(e) => updateSurveyData('thoiGianCongTacTaiDonVi', e.target.value)}
                      placeholder="Nhập số tháng"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="thoiGianCongTacTrongLinhVuc">Thời gian công tác trong lĩnh vực hiện tại (tháng)</Label>
                    <Input
                      id="thoiGianCongTacTrongLinhVuc"
                      type="number"
                      value={surveyData.thoiGianCongTacTrongLinhVuc}
                      onChange={(e) => updateSurveyData('thoiGianCongTacTrongLinhVuc', e.target.value)}
                      placeholder="Nhập số tháng"
                    />
                  </div>
                </div>

                <div>
                  <Label>Hình thức nhận lương *</Label>
                  <RadioGroup 
                    value={surveyData.hinhThucNhanLuong} 
                    onValueChange={(value) => updateSurveyData('hinhThucNhanLuong', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tien-mat" id="tien-mat" />
                      <Label htmlFor="tien-mat">Tiền mặt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chuyen-khoan" id="chuyen-khoan" />
                      <Label htmlFor="chuyen-khoan">Chuyển khoản</Label>
                    </div>
                  </RadioGroup>
                  
                  {surveyData.hinhThucNhanLuong === 'chuyen-khoan' && (
                    <div className="mt-2">
                      <Label htmlFor="nganhangNhanLuong">Ngân hàng nhận lương</Label>
                      <Input
                        id="nganhangNhanLuong"
                        value={surveyData.nganhangNhanLuong}
                        onChange={(e) => updateSurveyData('nganhangNhanLuong', e.target.value)}
                        placeholder="VD: Vietcombank, Techcombank, v.v."
                      />
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Ngân hàng đánh giá cao các khoản thu được chuyển khoản qua tài khoản ngân hàng
                  </p>
                </div>
              </div>
            )}

            {surveyData.loaiHinhNgheNghiep === 'tu-kinh-doanh' && (
              <div className="space-y-4">
                <h4 className="font-medium">Thông tin tự kinh doanh</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenDoanhNghiep">Tên doanh nghiệp/hộ kinh doanh *</Label>
                    <Input
                      id="tenDoanhNghiep"
                      value={surveyData.tenDoanhNghiep}
                      onChange={(e) => updateSurveyData('tenDoanhNghiep', e.target.value)}
                      placeholder="Nhập tên doanh nghiệp"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maSoThue">Mã số thuế doanh nghiệp/hộ kinh doanh *</Label>
                    <Input
                      id="maSoThue"
                      value={surveyData.maSoThue}
                      onChange={(e) => updateSurveyData('maSoThue', e.target.value)}
                      placeholder="Nhập mã số thuế"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Ngành nghề kinh doanh *</Label>
                    <Select value={surveyData.nganhNgheKinhDoanh} onValueChange={(value) => updateSurveyData('nganhNgheKinhDoanh', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngành nghề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cong-nghe-thong-tin">Công nghệ thông tin</SelectItem>
                        <SelectItem value="xay-dung">Xây dựng</SelectItem>
                        <SelectItem value="thuong-mai-dich-vu">Thương mại - Dịch vụ</SelectItem>
                        <SelectItem value="giao-duc-dao-tao">Giáo dục - Đào tạo</SelectItem>
                        <SelectItem value="y-te">Y tế</SelectItem>
                        <SelectItem value="nong-nghiep">Nông nghiệp</SelectItem>
                        <SelectItem value="san-xuat-cong-nghiep">Sản xuất - Công nghiệp</SelectItem>
                        <SelectItem value="tai-chinh-ngan-hang">Tài chính - Ngân hàng</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Loại hình kinh doanh *</Label>
                    <Select value={surveyData.loaiHinhKinhDoanh} onValueChange={(value) => updateSurveyData('loaiHinhKinhDoanh', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca-nhan">Cá nhân</SelectItem>
                        <SelectItem value="tnhh">TNHH</SelectItem>
                        <SelectItem value="co-phan">Cổ phần</SelectItem>
                        <SelectItem value="hop-danh">Hợp danh</SelectItem>
                        <SelectItem value="hop-tac-xa">Hợp tác xã</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="thoiGianKinhDoanh">Thời gian hoạt động kinh doanh đến thời điểm hiện tại (tháng)</Label>
                  <Input
                    id="thoiGianKinhDoanh"
                    type="number"
                    value={surveyData.thoiGianKinhDoanh}
                    onChange={(e) => updateSurveyData('thoiGianKinhDoanh', e.target.value)}
                    placeholder="Nhập số tháng"
                  />
                </div>
              </div>
            )}

            {surveyData.loaiHinhNgheNghiep === 'cho-thue' && (
              <div className="space-y-4">
                <h4 className="font-medium">Thông tin cho thuê tài sản</h4>
                
                <div>
                  <Label>Loại tài sản cho thuê</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {['Cho thuê Ô tô', 'Cho thuê BĐS', 'Cho thuê khác'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={option}
                          checked={surveyData.loaiChoThue.includes(option)}
                          onChange={(e) => {
                            const currentSelection = surveyData.loaiChoThue || [];
                            if (e.target.checked) {
                              updateSurveyData('loaiChoThue', [...currentSelection, option]);
                            } else {
                              updateSurveyData('loaiChoThue', currentSelection.filter((item: string) => item !== option));
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="thoiGianChoThue">Thời gian cho thuê trong lĩnh vực đến thời điểm hiện tại (tháng)</Label>
                  <Input
                    id="thoiGianChoThue"
                    type="number"
                    value={surveyData.thoiGianChoThue}
                    onChange={(e) => updateSurveyData('thoiGianChoThue', e.target.value)}
                    placeholder="Nhập số tháng"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Thông tin tài chính/tín dụng</h3>
            
            <div>
              <Label htmlFor="tongThuNhapGop">Tổng thu nhập gộp hàng tháng * (VNĐ)</Label>
              <Input
                id="tongThuNhapGop"
                type="number"
                value={surveyData.tongThuNhapGop}
                onChange={(e) => updateSurveyData('tongThuNhapGop', e.target.value)}
                placeholder="Nhập tổng thu nhập hàng tháng"
              />
            </div>

            <div>
              <Label>Hiện tại bạn đang có sử dụng thẻ tín dụng không? *</Label>
              <RadioGroup 
                value={surveyData.coSuDungTheTinDung} 
                onValueChange={(value) => updateSurveyData('coSuDungTheTinDung', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="co" id="co-the-tin-dung" />
                  <Label htmlFor="co-the-tin-dung">Có</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="khong" id="khong-the-tin-dung" />
                  <Label htmlFor="khong-the-tin-dung">Không</Label>
                </div>
              </RadioGroup>
            </div>

            {surveyData.coSuDungTheTinDung === 'co' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Thông tin thẻ tín dụng đang sử dụng</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nganhangPhatHanh">Ngân hàng phát hành</Label>
                    <Input
                      id="nganhangPhatHanh"
                      value={surveyData.thongTinTheTinDung.nganhangPhatHanh}
                      onChange={(e) => updateNestedData('thongTinTheTinDung', 'nganhangPhatHanh', e.target.value)}
                      placeholder="Tên ngân hàng"
                    />
                  </div>
                  
                  <div>
                    <Label>Loại thẻ</Label>
                    <Select 
                      value={surveyData.thongTinTheTinDung.loaiThe} 
                      onValueChange={(value) => updateNestedData('thongTinTheTinDung', 'loaiThe', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thẻ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="jcb">JCB</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hanMucTinDung">Hạn mức tín dụng (VNĐ)</Label>
                    <Input
                      id="hanMucTinDung"
                      type="number"
                      value={surveyData.thongTinTheTinDung.hanMucTinDung}
                      onChange={(e) => updateNestedData('thongTinTheTinDung', 'hanMucTinDung', e.target.value)}
                      placeholder="Hạn mức hiện tại"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="soTienTraHangThangThe">Số tiền phải trả hàng tháng * (VNĐ)</Label>
                    <Input
                      id="soTienTraHangThangThe"
                      type="number"
                      value={surveyData.thongTinTheTinDung.soTienTraHangThang}
                      onChange={(e) => updateNestedData('thongTinTheTinDung', 'soTienTraHangThang', e.target.value)}
                      placeholder="Số tiền trả hàng tháng"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Hiện tại bạn đang có vay cá nhân tại các ngân hàng/Cty tài chính không? *</Label>
              <RadioGroup 
                value={surveyData.coVayCaNhan} 
                onValueChange={(value) => updateSurveyData('coVayCaNhan', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="co" id="co-vay-ca-nhan" />
                  <Label htmlFor="co-vay-ca-nhan">Có</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="khong" id="khong-vay-ca-nhan" />
                  <Label htmlFor="khong-vay-ca-nhan">Không</Label>
                </div>
              </RadioGroup>
            </div>

            {surveyData.coVayCaNhan === 'co' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Thông tin vay cá nhân</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenNganHangVay">Tên ngân hàng/Cty tài chính</Label>
                    <Input
                      id="tenNganHangVay"
                      value={surveyData.thongTinVayCaNhan.tenNganHang}
                      onChange={(e) => updateNestedData('thongTinVayCaNhan', 'tenNganHang', e.target.value)}
                      placeholder="Tên ngân hàng/công ty"
                    />
                  </div>
                  
                  <div>
                    <Label>Thời hạn vay</Label>
                    <Select 
                      value={surveyData.thongTinVayCaNhan.thoiHanVay} 
                      onValueChange={(value) => updateNestedData('thongTinVayCaNhan', 'thoiHanVay', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thời hạn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngan-han">Ngắn hạn (≤12 tháng)</SelectItem>
                        <SelectItem value="trung-han">Trung hạn (13-60 tháng)</SelectItem>
                        <SelectItem value="dai-han">Dài hạn (> 60 tháng)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Hình thức vay</Label>
                    <Select 
                      value={surveyData.thongTinVayCaNhan.hinhThucVay} 
                      onValueChange={(value) => updateNestedData('thongTinVayCaNhan', 'hinhThucVay', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hình thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tin-chap">Tín chấp</SelectItem>
                        <SelectItem value="the-chap">Thế chấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="soTienTraHangThangVay">Số tiền phải trả hàng tháng * (VNĐ)</Label>
                    <Input
                      id="soTienTraHangThangVay"
                      type="number"
                      value={surveyData.thongTinVayCaNhan.soTienTraHangThang}
                      onChange={(e) => updateNestedData('thongTinVayCaNhan', 'soTienTraHangThang', e.target.value)}
                      placeholder="Số tiền trả hàng tháng"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Yêu cầu bổ sung</h3>
            
            <div>
              <Label htmlFor="yeuCauBoSung">Yêu cầu về thẻ tín dụng phát hành sắp tới</Label>
              <Textarea
                id="yeuCauBoSung"
                value={surveyData.yeuCauBoSung}
                onChange={(e) => updateSurveyData('yeuCauBoSung', e.target.value)}
                placeholder="Nhập các yêu cầu, mong muốn đặc biệt về thẻ tín dụng..."
                rows={6}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Tóm tắt thông tin đã điền</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <p><strong>Hạn mức mong muốn:</strong> {surveyData.hanMucMongMuon} triệu VNĐ</p>
                <p><strong>Loại thẻ:</strong> {surveyData.loaiTheMongMuon}</p>
                <p><strong>Họ tên:</strong> {surveyData.hoTen}</p>
                <p><strong>Nghề nghiệp:</strong> {surveyData.loaiHinhNgheNghiep}</p>
                <p><strong>Thu nhập gộp:</strong> {surveyData.tongThuNhapGop} VNĐ</p>
              </div>
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
            Khảo sát thông tin thẻ tín dụng
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
