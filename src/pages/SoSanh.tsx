
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
import { Search, ArrowRight, ChevronsUpDown, Check, Download, TrendingUp, Clock, FileText } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer } from 'recharts';
import Chatbot from '@/components/Chatbot';
import { formatCurrency } from '@/lib/utils';

// Dữ liệu ngân hàng mẫu
const bankData = [
  {
    id: 1,
    name: 'Ngân hàng Vietcombank',
    logo: '/assets/banks/vietcombank.png',
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
    logo: '/assets/banks/bidv.png',
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
    logo: '/assets/banks/techcombank.png',
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
    logo: '/assets/banks/mbbank.png',
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
    logo: '/assets/banks/vpbank.png',
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
  
  // Format loan amount with commas for display
  const formatLoanAmount = (amount: string) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle download report
  const handleDownloadReport = () => {
    toast.success("Đã tải báo cáo so sánh thành công!");
  };
  
  // Get loan type name in Vietnamese
  const getLoanTypeName = () => {
    switch(loanType) {
      case 'muaNha': return 'Vay mua nhà';
      case 'muaXe': return 'Vay mua xe';
      case 'kinhDoanh': return 'Vay kinh doanh';
      default: return '';
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-8 mb-8 text-white shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">So sánh khoản vay</h1>
          <p className="text-center text-lg opacity-90">Tìm khoản vay phù hợp nhất với nhu cầu của bạn</p>
        </div>
        
        {surveyData && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg shadow-sm">
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
        
        <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-500" />
              Tham số khoản vay
            </CardTitle>
            <CardDescription>Điền thông tin khoản vay bạn muốn so sánh</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount" className="text-sm font-medium">Số tiền vay (VND)</Label>
                <div className="relative">
                  <Input
                    id="loanAmount"
                    type="text"
                    value={formatLoanAmount(loanAmount)}
                    onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="500,000,000"
                    className="pl-10 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    ₫
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm" className="text-sm font-medium">Thời hạn vay (năm)</Label>
                <Select value={loanTerm} onValueChange={setLoanTerm}>
                  <SelectTrigger id="loanTerm" className="focus:ring-brand-500 focus:border-brand-500">
                    <SelectValue placeholder="Chọn thời hạn vay" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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
                <Label htmlFor="loanType" className="text-sm font-medium">Loại khoản vay</Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger id="loanType" className="focus:ring-brand-500 focus:border-brand-500">
                    <SelectValue placeholder="Chọn loại khoản vay" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="muaNha">Vay mua nhà</SelectItem>
                    <SelectItem value="muaXe">Vay mua xe</SelectItem>
                    <SelectItem value="kinhDoanh">Vay kinh doanh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <Button onClick={calculateComparison} className="ml-auto bg-brand-600 hover:bg-brand-700 transition-colors shadow">
              <Search className="mr-2 h-4 w-4" />
              So sánh ngay
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            Chọn ngân hàng để so sánh
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {bankData.map((bank) => (
              <Card 
                key={bank.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedBanks.includes(bank.id) 
                    ? 'border-brand-500 bg-brand-50 shadow' 
                    : 'border-gray-200 hover:border-brand-300 hover:shadow'
                }`}
                onClick={() => toggleBank(bank.id)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  <div className="h-16 flex items-center justify-center mb-3">
                    <img 
                      src={bank.logo} 
                      alt={bank.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-sm text-center font-medium text-gray-800">
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
            <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-md border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand-500" />
                  Kết quả so sánh
                </h2>
                <div className="bg-white px-4 py-2 rounded-lg text-sm text-gray-700 shadow-sm border border-gray-200 mt-2 md:mt-0">
                  Đang so sánh: <span className="font-semibold text-brand-600">{getLoanTypeName()}</span> - 
                  <span className="font-semibold text-brand-600"> {formatLoanAmount(loanAmount)} VND</span> -
                  <span className="font-semibold text-brand-600"> {loanTerm} năm</span>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableCaption className="pb-2">So sánh các khoản vay theo tham số đã nhập</TableCaption>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold">Ngân hàng</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 font-semibold transition-colors" 
                          onClick={() => handleSort('interestRate')}
                        >
                          <div className="flex items-center">
                            Lãi suất (%)
                            {sortField === 'interestRate' && (
                              <ChevronsUpDown className="inline-block ml-1 h-4 w-4 text-brand-500" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 font-semibold transition-colors" 
                          onClick={() => handleSort('monthlyPayment')}
                        >
                          <div className="flex items-center">
                            Trả hàng tháng
                            {sortField === 'monthlyPayment' && (
                              <ChevronsUpDown className="inline-block ml-1 h-4 w-4 text-brand-500" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 font-semibold transition-colors" 
                          onClick={() => handleSort('totalInterest')}
                        >
                          <div className="flex items-center">
                            Tổng tiền lãi
                            {sortField === 'totalInterest' && (
                              <ChevronsUpDown className="inline-block ml-1 h-4 w-4 text-brand-500" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 font-semibold transition-colors" 
                          onClick={() => handleSort('totalPayment')}
                        >
                          <div className="flex items-center">
                            Tổng tiền trả
                            {sortField === 'totalPayment' && (
                              <ChevronsUpDown className="inline-block ml-1 h-4 w-4 text-brand-500" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 font-semibold transition-colors" 
                          onClick={() => handleSort('processingFee')}
                        >
                          <div className="flex items-center">
                            Phí xử lý (%)
                            {sortField === 'processingFee' && (
                              <ChevronsUpDown className="inline-block ml-1 h-4 w-4 text-brand-500" />
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonResults.map((result, index) => (
                        <TableRow key={result.bankId} className={index === 0 ? "bg-brand-50" : ""}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 flex items-center justify-center bg-white p-1 rounded shadow-sm">
                                <img 
                                  src={result.bankLogo} 
                                  alt={result.bankName} 
                                  className="h-6 w-auto"
                                />
                              </div>
                              <span className={index === 0 ? "font-medium" : ""}>{result.bankName}</span>
                              {index === 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Tốt nhất
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={index === 0 ? "font-medium" : ""}>{result.interestRate.toFixed(2)}%</TableCell>
                          <TableCell className={index === 0 ? "font-medium" : ""}>{formatCurrency(Math.round(result.monthlyPayment))} VND</TableCell>
                          <TableCell className={index === 0 ? "font-medium" : ""}>{formatCurrency(Math.round(result.totalInterest))} VND</TableCell>
                          <TableCell className={index === 0 ? "font-medium" : ""}>{formatCurrency(Math.round(result.totalPayment))} VND</TableCell>
                          <TableCell className={index === 0 ? "font-medium" : ""}>{result.processingFee.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-500" />
                Chi tiết khoản vay
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comparisonResults.map((result, index) => (
                  <Card key={result.bankId} className={`overflow-hidden hover:shadow-lg transition-shadow ${index === 0 ? 'border-brand-500 ring-1 ring-brand-500/20' : ''}`}>
                    <CardHeader className={`${index === 0 ? 'bg-brand-50' : 'bg-gray-50'} border-b`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-white rounded-lg shadow-sm flex items-center justify-center p-1">
                            <img 
                              src={result.bankLogo} 
                              alt={result.bankName} 
                              className="h-8 w-auto"
                            />
                          </div>
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
                      {index === 0 && (
                        <div className="mt-2 text-xs text-brand-600 font-medium">Đề xuất tốt nhất theo tiêu chí hiện tại</div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Lãi suất</div>
                          <div className="text-xl font-bold text-brand-600">{result.interestRate.toFixed(2)}%</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Trả hàng tháng</div>
                          <div className="text-xl font-bold">{formatCurrency(Math.round(result.monthlyPayment))} VND</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Tổng tiền lãi</div>
                          <div className="font-semibold">{formatCurrency(Math.round(result.totalInterest))} VND</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Tổng tiền trả</div>
                          <div className="font-semibold">{formatCurrency(Math.round(result.totalPayment))} VND</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Phí xử lý</div>
                          <div className="font-semibold">{formatCurrency(Math.round(result.processingFeeAmount))} VND</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Thời gian phê duyệt</div>
                          <div className="font-semibold">{result.approvalTime} ngày</div>
                        </div>
                      </div>
                      
                      <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Giấy tờ yêu cầu</div>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          {result.requirements.map((req: string, index: number) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t flex justify-between">
                      <Button variant="outline" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(result.bankName)}+vay+${loanType === 'muaNha' ? 'mua+nhà' : loanType === 'muaXe' ? 'mua+xe' : 'kinh+doanh'}`, '_blank')}>
                        Tìm hiểu thêm
                      </Button>
                      <Button className="bg-brand-600 hover:bg-brand-700 transition-colors">
                        Liên hệ ngay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-500" />
                  Biểu đồ so sánh
                </CardTitle>
                <CardDescription>So sánh trực quan giữa các ngân hàng</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-72 md:h-96 p-4">
                  {comparisonResults.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip contentStyle={{background: 'white', border: '1px solid #f0f0f0', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
                        <RechartsLegend verticalAlign="top" height={36} />
                        <Bar dataKey="Lãi suất (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Tổng chi phí (triệu)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" className="ml-auto" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Tải báo cáo PDF
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
        
        <div className="mt-8 text-center bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Chưa tìm thấy khoản vay phù hợp?</h3>
          <p className="text-gray-500 mb-4">Hãy thực hiện khảo sát chi tiết để chúng tôi gợi ý cho bạn khoản vay phù hợp nhất</p>
          <Button 
            onClick={() => navigate('/khao-sat')} 
            className="bg-brand-600 hover:bg-brand-700 transition-colors shadow"
            size="lg"
          >
            Thực hiện khảo sát chi tiết
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SoSanh;
