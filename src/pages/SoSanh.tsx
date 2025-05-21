
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { Search, ArrowRight, ChevronsUpDown, Check, Download } from 'lucide-react';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line } from 'recharts';
import Chatbot from '@/components/Chatbot';
import { formatCurrency } from '@/lib/utils';

// Đăng ký các thành phần Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Dữ liệu ngân hàng mẫu
const bankData = [
  {
    id: 1,
    name: 'Ngân hàng Vietcombank',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/7/7c/Vietcombank_logo.svg',
    loanTypes: {
      muaNha: {
        interestRate: 7.5,
        maxTerm: 25,
        maxAmount: 1000000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 5,
      },
      muaXe: {
        interestRate: 8.0,
        maxTerm: 7,
        maxAmount: 500000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 3,
      },
      kinhDoanh: {
        interestRate: 9.0,
        maxTerm: 5,
        maxAmount: 300000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'GPKD', 'BCTC 2 năm'],
        approvalTime: 7,
      },
    },
    ranking: 4.5,
  },
  {
    id: 2,
    name: 'Ngân hàng BIDV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/BIDV_logo.svg',
    loanTypes: {
      muaNha: {
        interestRate: 7.7,
        maxTerm: 25,
        maxAmount: 1000000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 6 tháng'],
        approvalTime: 7,
      },
      muaXe: {
        interestRate: 8.2,
        maxTerm: 7,
        maxAmount: 500000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 6 tháng'],
        approvalTime: 5,
      },
      kinhDoanh: {
        interestRate: 9.2,
        maxTerm: 5,
        maxAmount: 300000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'GPKD', 'BCTC 2 năm'],
        approvalTime: 7,
      },
    },
    ranking: 4.3,
  },
  {
    id: 3,
    name: 'Ngân hàng Techcombank',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/7/7e/Techcombank_logo.png',
    loanTypes: {
      muaNha: {
        interestRate: 7.3,
        maxTerm: 25,
        maxAmount: 1000000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 4,
      },
      muaXe: {
        interestRate: 7.9,
        maxTerm: 7,
        maxAmount: 500000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 2,
      },
      kinhDoanh: {
        interestRate: 8.5,
        maxTerm: 5,
        maxAmount: 300000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'GPKD', 'BCTC 2 năm'],
        approvalTime: 5,
      },
    },
    ranking: 4.7,
  },
  {
    id: 4,
    name: 'Ngân hàng MB Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png',
    loanTypes: {
      muaNha: {
        interestRate: 7.6,
        maxTerm: 25,
        maxAmount: 1000000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 5,
      },
      muaXe: {
        interestRate: 8.1,
        maxTerm: 7,
        maxAmount: 500000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 4,
      },
      kinhDoanh: {
        interestRate: 8.8,
        maxTerm: 5,
        maxAmount: 300000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'GPKD', 'BCTC 2 năm'],
        approvalTime: 6,
      },
    },
    ranking: 4.4,
  },
  {
    id: 5,
    name: 'Ngân hàng VPBank',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/8/8c/VPBank_logo.png',
    loanTypes: {
      muaNha: {
        interestRate: 7.9,
        maxTerm: 25,
        maxAmount: 1000000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 6,
      },
      muaXe: {
        interestRate: 8.3,
        maxTerm: 7,
        maxAmount: 500000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'Hợp đồng lao động', 'Sao kê lương 3 tháng'],
        approvalTime: 4,
      },
      kinhDoanh: {
        interestRate: 9.1,
        maxTerm: 5,
        maxAmount: 300000000,
        processingFee: 0.5,
        earlyPaymentFee: 2,
        requirements: ['CMND/CCCD', 'Hộ khẩu', 'GPKD', 'BCTC 2 năm'],
        approvalTime: 7,
      },
    },
    ranking: 4.2,
  },
];

const SoSanh = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState('500000000');
  const [loanTerm, setLoanTerm] = useState('5');
  const [loanType, setLoanType] = useState('muaNha');
  const [selectedBanks, setSelectedBanks] = useState<number[]>([1, 2, 3]);
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);
  const [sortField, setSortField] = useState('interestRate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Kết quả khảo sát từ localStorage (nếu có)
  const [surveyData, setSurveyData] = useState<any>(null);
  
  useEffect(() => {
    // Lấy kết quả khảo sát từ localStorage nếu có
    const savedSurvey = localStorage.getItem('ketQuaKhaoSat');
    if (savedSurvey) {
      const parsedData = JSON.parse(savedSurvey);
      setSurveyData(parsedData);
      
      // Tự động điền thông tin từ khảo sát
      if (parsedData.thongTinKhoanVay) {
        if (parsedData.thongTinKhoanVay.soTienVay) {
          setLoanAmount(parsedData.thongTinKhoanVay.soTienVay.replace(/[^0-9]/g, ''));
        }
        if (parsedData.thongTinKhoanVay.mucDichVay) {
          setLoanType(parsedData.thongTinKhoanVay.mucDichVay);
        }
        if (parsedData.thongTinKhoanVay.thoiHanVay) {
          switch (parsedData.thongTinKhoanVay.thoiHanVay) {
            case 'duoi12thang':
              setLoanTerm('1');
              break;
            case '1-3nam':
              setLoanTerm('3');
              break;
            case '3-5nam':
              setLoanTerm('5');
              break;
            case '5-10nam':
              setLoanTerm('10');
              break;
            case 'tren10nam':
              setLoanTerm('20');
              break;
            default:
              setLoanTerm('5');
          }
        }
      }
    }
  }, []);
  
  // Tính toán kết quả so sánh khi các tham số thay đổi
  useEffect(() => {
    calculateComparison();
  }, [loanAmount, loanTerm, loanType, selectedBanks, sortField, sortOrder]);
  
  // Hàm tính toán kết quả so sánh
  const calculateComparison = () => {
    const amount = parseFloat(loanAmount);
    const term = parseInt(loanTerm);
    
    if (isNaN(amount) || isNaN(term) || amount <= 0 || term <= 0) {
      return;
    }
    
    const results = bankData
      .filter(bank => selectedBanks.includes(bank.id))
      .map(bank => {
        const loanInfo = bank.loanTypes[loanType as keyof typeof bank.loanTypes];
        const monthlyRate = loanInfo.interestRate / 100 / 12;
        const totalMonths = term * 12;
        
        // Tính toán theo công thức PMT
        const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                              (Math.pow(1 + monthlyRate, totalMonths) - 1);
        
        const totalPayment = monthlyPayment * totalMonths;
        const totalInterest = totalPayment - amount;
        const processingFeeAmount = (amount * loanInfo.processingFee) / 100;
        
        return {
          bankId: bank.id,
          bankName: bank.name,
          bankLogo: bank.logo,
          interestRate: loanInfo.interestRate,
          monthlyPayment,
          totalInterest,
          totalPayment,
          processingFee: loanInfo.processingFee,
          processingFeeAmount,
          earlyPaymentFee: loanInfo.earlyPaymentFee,
          requirements: loanInfo.requirements,
          approvalTime: loanInfo.approvalTime,
          totalCost: totalInterest + processingFeeAmount,
          ranking: bank.ranking,
        };
      });
    
    // Sắp xếp kết quả
    const sortedResults = [...results].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] - b[sortField];
      } else {
        return b[sortField] - a[sortField];
      }
    });
    
    setComparisonResults(sortedResults);
  };
  
  // Xử lý thay đổi trường sắp xếp
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Đảo chiều sắp xếp nếu đang sắp xếp theo trường này
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Đặt trường sắp xếp mới và đặt lại chiều sắp xếp thành tăng dần
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Xử lý chọn/bỏ chọn ngân hàng
  const toggleBank = (bankId: number) => {
    setSelectedBanks(prev => {
      if (prev.includes(bankId)) {
        return prev.filter(id => id !== bankId);
      } else {
        return [...prev, bankId];
      }
    });
  };
  
  // Tạo dữ liệu cho biểu đồ so sánh
  const getChartData = () => {
    if (comparisonResults.length === 0) return [];
    
    return comparisonResults.map(result => ({
      name: result.bankName,
      'Lãi suất (%)': result.interestRate,
      'Tiền lãi (triệu)': Math.round(result.totalInterest / 1000000),
      'Tổng chi phí (triệu)': Math.round(result.totalCost / 1000000),
    }));
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">So sánh khoản vay</h1>
        
        {surveyData && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Thông tin của bạn đã được tải từ kết quả khảo sát. Xếp hạng tín dụng của bạn: 
                  <span className="font-bold ml-1">{surveyData.ketQua.phanKhuc}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tham số khoản vay</CardTitle>
            <CardDescription>Điền thông tin khoản vay bạn muốn so sánh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Số tiền vay (VND)</Label>
                <Input
                  id="loanAmount"
                  type="text"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="500,000,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Thời hạn vay (năm)</Label>
                <Select value={loanTerm} onValueChange={setLoanTerm}>
                  <SelectTrigger id="loanTerm">
                    <SelectValue placeholder="Chọn thời hạn vay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 năm</SelectItem>
                    <SelectItem value="3">3 năm</SelectItem>
                    <SelectItem value="5">5 năm</SelectItem>
                    <SelectItem value="10">10 năm</SelectItem>
                    <SelectItem value="15">15 năm</SelectItem>
                    <SelectItem value="20">20 năm</SelectItem>
                    <SelectItem value="25">25 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanType">Loại khoản vay</Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger id="loanType">
                    <SelectValue placeholder="Chọn loại khoản vay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muaNha">Vay mua nhà</SelectItem>
                    <SelectItem value="muaXe">Vay mua xe</SelectItem>
                    <SelectItem value="kinhDoanh">Vay kinh doanh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={calculateComparison} className="ml-auto">
              <Search className="mr-2 h-4 w-4" />
              So sánh ngay
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Chọn ngân hàng để so sánh</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {bankData.map((bank) => (
              <Card 
                key={bank.id}
                className={`cursor-pointer transition-all ${
                  selectedBanks.includes(bank.id) 
                    ? 'border-brand-500 bg-brand-50' 
                    : 'border-gray-200 hover:border-brand-300'
                }`}
                onClick={() => toggleBank(bank.id)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="h-16 flex items-center justify-center mb-2">
                    <img 
                      src={bank.logo} 
                      alt={bank.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-sm text-center font-medium">
                    {bank.name}
                  </h3>
                  {selectedBanks.includes(bank.id) && (
                    <div className="mt-2 flex items-center justify-center text-brand-600">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {comparisonResults.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Kết quả so sánh</h2>
            
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableCaption>So sánh các khoản vay theo tham số đã nhập</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngân hàng</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50" 
                        onClick={() => handleSort('interestRate')}
                      >
                        Lãi suất (%)
                        {sortField === 'interestRate' && (
                          <ChevronsUpDown className="inline-block ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50" 
                        onClick={() => handleSort('monthlyPayment')}
                      >
                        Trả hàng tháng
                        {sortField === 'monthlyPayment' && (
                          <ChevronsUpDown className="inline-block ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50" 
                        onClick={() => handleSort('totalInterest')}
                      >
                        Tổng tiền lãi
                        {sortField === 'totalInterest' && (
                          <ChevronsUpDown className="inline-block ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50" 
                        onClick={() => handleSort('totalPayment')}
                      >
                        Tổng tiền trả
                        {sortField === 'totalPayment' && (
                          <ChevronsUpDown className="inline-block ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50" 
                        onClick={() => handleSort('processingFee')}
                      >
                        Phí xử lý (%)
                        {sortField === 'processingFee' && (
                          <ChevronsUpDown className="inline-block ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonResults.map((result) => (
                      <TableRow key={result.bankId}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <img 
                              src={result.bankLogo} 
                              alt={result.bankName} 
                              className="h-6 w-auto"
                            />
                            <span>{result.bankName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{result.interestRate.toFixed(2)}%</TableCell>
                        <TableCell>{formatCurrency(Math.round(result.monthlyPayment))} VND</TableCell>
                        <TableCell>{formatCurrency(Math.round(result.totalInterest))} VND</TableCell>
                        <TableCell>{formatCurrency(Math.round(result.totalPayment))} VND</TableCell>
                        <TableCell>{result.processingFee.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {comparisonResults.map((result) => (
                <Card key={result.bankId} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={result.bankLogo} 
                          alt={result.bankName} 
                          className="h-8 w-auto"
                        />
                        <CardTitle className="text-lg">{result.bankName}</CardTitle>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(result.ranking) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm">{result.ranking.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Lãi suất</div>
                        <div className="text-xl font-bold text-brand-600">{result.interestRate.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Trả hàng tháng</div>
                        <div className="text-xl font-bold">{formatCurrency(Math.round(result.monthlyPayment))} VND</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Tổng tiền lãi</div>
                        <div className="font-semibold">{formatCurrency(Math.round(result.totalInterest))} VND</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Tổng tiền trả</div>
                        <div className="font-semibold">{formatCurrency(Math.round(result.totalPayment))} VND</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Phí xử lý</div>
                        <div className="font-semibold">{formatCurrency(Math.round(result.processingFeeAmount))} VND</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Thời gian phê duyệt</div>
                        <div className="font-semibold">{result.approvalTime} ngày</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">Giấy tờ yêu cầu</div>
                      <ul className="text-sm list-disc pl-5">
                        {result.requirements.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-between">
                    <Button variant="outline" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(result.bankName)}+vay+${loanType === 'muaNha' ? 'mua+nhà' : loanType === 'muaXe' ? 'mua+xe' : 'kinh+doanh'}`, '_blank')}>
                      Tìm hiểu thêm
                    </Button>
                    <Button>
                      Liên hệ ngay
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Biểu đồ so sánh</CardTitle>
                <CardDescription>So sánh trực quan giữa các ngân hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-72 md:h-96">
                  {/* Biểu đồ so sánh sẽ được hiển thị tại đây */}
                  {/* Do đây là mockup nên chúng ta không thực sự render biểu đồ Recharts */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="text-center">
                      <p className="text-gray-500">Biểu đồ so sánh các khoản vay</p>
                      <p className="text-sm text-gray-400 mt-2">Hiển thị so sánh trực quan giữa các ngân hàng</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto" onClick={() => toast.success("Đã tải báo cáo so sánh!")}>
                  <Download className="mr-2 h-4 w-4" />
                  Tải báo cáo PDF
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Chưa tìm thấy khoản vay phù hợp?</p>
          <Button variant="outline" onClick={() => navigate('/khao-sat')}>
            Thực hiện khảo sát chi tiết
          </Button>
        </div>
      </div>
      
      {/* Chatbot */}
      <Chatbot initialMessage="Xin chào! Tôi có thể giúp gì cho bạn về việc so sánh các khoản vay?" />
    </Layout>
  );
};

export default SoSanh;
