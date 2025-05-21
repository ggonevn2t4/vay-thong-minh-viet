
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowRight, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import Chatbot from '@/components/Chatbot';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

// Define form schema using Zod
const formSchema = z.object({
  // Thông tin cá nhân
  hoTen: z.string().min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' }),
  tuoi: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 18, {
    message: 'Tuổi phải từ 18 trở lên',
  }),
  soDienThoai: z.string().min(10, { message: 'Số điện thoại phải có ít nhất 10 số' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  diaChi: z.string().min(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự' }),
  
  // Thông tin nghề nghiệp
  ngheNghiep: z.string().min(1, { message: 'Vui lòng chọn nghề nghiệp' }),
  noiLamViec: z.string().min(2, { message: 'Vui lòng nhập nơi làm việc' }),
  thoiGianLamViec: z.string().min(1, { message: 'Vui lòng chọn thời gian làm việc' }),
  
  // Thông tin tài chính
  thuNhap: z.string().min(1, { message: 'Vui lòng chọn mức thu nhập' }),
  coTaiSanDamBao: z.string().min(1, { message: 'Vui lòng chọn có hoặc không' }),
  loaiTaiSanDamBao: z.string().optional(),
  giaTriTaiSanDamBao: z.string().optional(),
  
  // Thông tin khoản vay
  soTienVay: z.string().min(1, { message: 'Vui lòng nhập số tiền muốn vay' }),
  mucDichVay: z.string().min(1, { message: 'Vui lòng chọn mục đích vay' }),
  thoiHanVay: z.string().min(1, { message: 'Vui lòng chọn thời hạn vay' }),
  
  // Lịch sử tín dụng
  coVayNganHang: z.string().min(1, { message: 'Vui lòng chọn có hoặc không' }),
  coNoXau: z.string().min(1, { message: 'Vui lòng chọn có hoặc không' }),
  
  // Đồng ý điều khoản
  dongYDieuKhoan: z.literal(true, {
    errorMap: () => ({ message: 'Bạn phải đồng ý với điều khoản để tiếp tục' }),
  }),
});

const KhaoSat = () => {
  const navigate = useNavigate();
  const [isOpenHelp, setIsOpenHelp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hoTen: '',
      tuoi: '',
      soDienThoai: '',
      email: '',
      diaChi: '',
      ngheNghiep: '',
      noiLamViec: '',
      thoiGianLamViec: '',
      thuNhap: '',
      coTaiSanDamBao: '',
      loaiTaiSanDamBao: '',
      giaTriTaiSanDamBao: '',
      soTienVay: '',
      mucDichVay: '',
      thoiHanVay: '',
      coVayNganHang: '',
      coNoXau: '',
      dongYDieuKhoan: false,
    },
  });
  
  // Watch form values for conditional fields
  const coTaiSanDamBao = form.watch('coTaiSanDamBao');
  const coNoXau = form.watch('coNoXau');
  
  // Calculate form progress
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Check if user has bad credit history
    if (values.coNoXau === 'co') {
      toast.error('Rất tiếc, bạn không đủ điều kiện vay do lịch sử tín dụng xấu.');
      return;
    }
    
    // Calculate credit score
    let score = 0;
    
    // Nghề nghiệp ổn định
    if (values.thoiGianLamViec === 'tren3nam') score += 20;
    else if (values.thoiGianLamViec === '1-3nam') score += 15;
    else score += 5;
    
    // Thu nhập
    if (values.thuNhap === 'tren20tr') score += 25;
    else if (values.thuNhap === '10-20tr') score += 20;
    else if (values.thuNhap === '5-10tr') score += 15;
    else score += 5;
    
    // Tài sản đảm bảo
    if (values.coTaiSanDamBao === 'co') score += 20;
    
    // Lịch sử tín dụng
    if (values.coVayNganHang === 'khong') score += 15;
    else score += 10;
    
    // Tiếp tục với phân khúc người dùng
    let phanKhuc = '';
    if (score >= 80) phanKhuc = 'A';
    else if (score >= 60) phanKhuc = 'B';
    else if (score >= 40) phanKhuc = 'C';
    else phanKhuc = 'D';
    
    // Lưu thông tin vào localStorage
    const ketQua = {
      thongTinCaNhan: {
        hoTen: values.hoTen,
        tuoi: values.tuoi,
        soDienThoai: values.soDienThoai,
        email: values.email,
        diaChi: values.diaChi,
      },
      thongTinNgheNghiep: {
        ngheNghiep: values.ngheNghiep,
        noiLamViec: values.noiLamViec,
        thoiGianLamViec: values.thoiGianLamViec,
      },
      thongTinTaiChinh: {
        thuNhap: values.thuNhap,
        coTaiSanDamBao: values.coTaiSanDamBao,
        loaiTaiSanDamBao: values.loaiTaiSanDamBao,
        giaTriTaiSanDamBao: values.giaTriTaiSanDamBao,
      },
      thongTinKhoanVay: {
        soTienVay: values.soTienVay,
        mucDichVay: values.mucDichVay,
        thoiHanVay: values.thoiHanVay,
      },
      lichSuTinDung: {
        coVayNganHang: values.coVayNganHang,
        coNoXau: values.coNoXau,
      },
      ketQua: {
        diemTinDung: score,
        phanKhuc: phanKhuc,
      },
    };
    
    localStorage.setItem('ketQuaKhaoSat', JSON.stringify(ketQua));
    
    // Chuyển hướng đến trang kết quả
    navigate('/ket-qua');
    toast.success('Khảo sát đã hoàn thành! Đang phân tích kết quả...');
  };
  
  // Handle next step
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const result = await form.trigger(['hoTen', 'tuoi', 'soDienThoai', 'email', 'diaChi']);
      if (result) setCurrentStep(2);
    } else if (currentStep === 2) {
      const result = await form.trigger(['ngheNghiep', 'noiLamViec', 'thoiGianLamViec', 'thuNhap', 'coTaiSanDamBao']);
      if (result) {
        if (form.getValues('coTaiSanDamBao') === 'co') {
          const assetResult = await form.trigger(['loaiTaiSanDamBao', 'giaTriTaiSanDamBao']);
          if (assetResult) setCurrentStep(3);
        } else {
          setCurrentStep(3);
        }
      }
    } else if (currentStep === 3) {
      const result = await form.trigger(['soTienVay', 'mucDichVay', 'thoiHanVay']);
      if (result) setCurrentStep(4);
    } else if (currentStep === 4) {
      const result = await form.trigger(['coVayNganHang', 'coNoXau', 'dongYDieuKhoan']);
      if (result) form.handleSubmit(onSubmit)();
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Render form steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Vui lòng cung cấp thông tin cá nhân của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="hoTen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tuoi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuổi</FormLabel>
                    <FormControl>
                      <Input placeholder="30" type="number" min="18" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="soDienThoai"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="098xxxxxxx" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="diaChi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Đường ABC, Quận XYZ, TP. HCM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );
        
      case 2:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Thông tin nghề nghiệp và tài chính</CardTitle>
              <CardDescription>Vui lòng cung cấp thông tin về nghề nghiệp và tình hình tài chính của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="ngheNghiep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nghề nghiệp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nhanVienVanPhong">Nhân viên văn phòng</SelectItem>
                        <SelectItem value="congNhanVienChuc">Công nhân viên chức</SelectItem>
                        <SelectItem value="kiDoanhTuDo">Kinh doanh tự do</SelectItem>
                        <SelectItem value="giaoVien">Giáo viên</SelectItem>
                        <SelectItem value="bacSi">Bác sĩ</SelectItem>
                        <SelectItem value="kysu">Kỹ sư</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="noiLamViec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nơi làm việc</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên công ty/tổ chức" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="thoiGianLamViec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian làm việc tại nơi hiện tại</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thời gian làm việc" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="duoi1nam">Dưới 1 năm</SelectItem>
                        <SelectItem value="1-3nam">1 - 3 năm</SelectItem>
                        <SelectItem value="tren3nam">Trên 3 năm</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="thuNhap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thu nhập hàng tháng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mức thu nhập" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="duoi5tr">Dưới 5 triệu</SelectItem>
                        <SelectItem value="5-10tr">5 - 10 triệu</SelectItem>
                        <SelectItem value="10-20tr">10 - 20 triệu</SelectItem>
                        <SelectItem value="tren20tr">Trên 20 triệu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coTaiSanDamBao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bạn có tài sản đảm bảo không?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn có hoặc không" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="co">Có</SelectItem>
                        <SelectItem value="khong">Không</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {coTaiSanDamBao === 'co' && (
                <>
                  <FormField
                    control={form.control}
                    name="loaiTaiSanDamBao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại tài sản đảm bảo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại tài sản" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nha">Nhà/Căn hộ</SelectItem>
                            <SelectItem value="dat">Đất</SelectItem>
                            <SelectItem value="oto">Ô tô</SelectItem>
                            <SelectItem value="soTietKiem">Sổ tiết kiệm</SelectItem>
                            <SelectItem value="khac">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="giaTriTaiSanDamBao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá trị tài sản đảm bảo (VND)</FormLabel>
                        <FormControl>
                          <Input placeholder="500,000,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>
        );
        
      case 3:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Thông tin khoản vay</CardTitle>
              <CardDescription>Vui lòng cung cấp thông tin về khoản vay mà bạn mong muốn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="soTienVay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền muốn vay (VND)</FormLabel>
                    <FormControl>
                      <Input placeholder="200,000,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mucDichVay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mục đích vay</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mục đích vay" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="muaNha">Mua nhà/căn hộ</SelectItem>
                        <SelectItem value="muaXe">Mua xe</SelectItem>
                        <SelectItem value="duHoc">Du học</SelectItem>
                        <SelectItem value="kinhDoanh">Kinh doanh</SelectItem>
                        <SelectItem value="tieuDung">Tiêu dùng</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="thoiHanVay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời hạn vay mong muốn</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thời hạn vay" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="duoi12thang">Dưới 12 tháng</SelectItem>
                        <SelectItem value="1-3nam">1 - 3 năm</SelectItem>
                        <SelectItem value="3-5nam">3 - 5 năm</SelectItem>
                        <SelectItem value="5-10nam">5 - 10 năm</SelectItem>
                        <SelectItem value="tren10nam">Trên 10 năm</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );
        
      case 4:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Lịch sử tín dụng và xác nhận</CardTitle>
              <CardDescription>Vui lòng cung cấp thông tin về lịch sử tín dụng và xác nhận điều khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="coVayNganHang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bạn có đang vay tại ngân hàng/tổ chức tín dụng nào không?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn có hoặc không" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="co">Có</SelectItem>
                        <SelectItem value="khong">Không</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coNoXau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Bạn có nợ xấu từ nhóm 2 trở lên không?
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-help">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="w-80">
                            <p>Nợ nhóm 2 là nợ quá hạn từ 10 đến 90 ngày. Nhóm 3 trở lên là nợ xấu.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn có hoặc không" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="co">Có</SelectItem>
                        <SelectItem value="khong">Không</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {coNoXau === 'co' && (
                <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Việc có nợ xấu từ nhóm 2 trở lên có thể ảnh hưởng đến khả năng được phê duyệt khoản vay. 
                          Vui lòng liên hệ trực tiếp với nhân viên tư vấn để được hỗ trợ tốt nhất.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="dongYDieuKhoan"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Tôi đồng ý với các điều khoản sử dụng và chính sách bảo mật
                      </FormLabel>
                      <FormDescription>
                        Bằng việc đồng ý, bạn cho phép chúng tôi sử dụng thông tin để tìm kiếm các sản phẩm vay phù hợp.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Khảo sát nhu cầu vay vốn</h1>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {renderStep()}
            
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  Quay lại
                </Button>
              )}
              
              <Button
                type="button"
                className={`${currentStep === 1 ? 'ml-auto' : ''}`}
                onClick={handleNextStep}
              >
                {currentStep < totalSteps ? 'Tiếp theo' : 'Hoàn thành'}
                {currentStep < totalSteps && <ArrowRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Form>
        
        <Collapsible
          open={isOpenHelp}
          onOpenChange={setIsOpenHelp}
          className="mt-8 border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Bạn cần hỗ trợ?</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpenHelp ? "Ẩn bớt" : "Xem thêm"}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-4 space-y-4">
            <p>Nếu bạn cần hỗ trợ thêm về khảo sát này, vui lòng liên hệ với chúng tôi qua:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hotline: <strong>1900 1234</strong></li>
              <li>Email: <strong>hotro@vaythongminh.vn</strong></li>
              <li>Hoặc chat với trợ lý ảo của chúng tôi</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Chatbot */}
      <Chatbot initialMessage="Xin chào! Tôi là trợ lý ảo của VayThôngMinh. Bạn cần hỗ trợ gì về khảo sát vay vốn không?" />
    </Layout>
  );
};

export default KhaoSat;
