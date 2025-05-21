
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoanComparison = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">So sánh các loại khoản vay</h1>
        
        <Tabs defaultValue="personal" className="w-full mb-10">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="personal">Vay cá nhân</TabsTrigger>
            <TabsTrigger value="mortgage">Vay mua nhà</TabsTrigger>
            <TabsTrigger value="business">Vay kinh doanh</TabsTrigger>
            <TabsTrigger value="car">Vay mua xe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>So sánh khoản vay cá nhân</CardTitle>
                <CardDescription>
                  So sánh lãi suất và điều kiện vay cá nhân từ các ngân hàng hàng đầu Việt Nam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Cập nhật tháng 05/2025</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngân hàng</TableHead>
                      <TableHead>Lãi suất</TableHead>
                      <TableHead>Khoản vay tối đa</TableHead>
                      <TableHead>Thời hạn vay</TableHead>
                      <TableHead>Yêu cầu thu nhập</TableHead>
                      <TableHead>Tài sản đảm bảo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Vietcombank</TableCell>
                      <TableCell>7.5% - 9.5%</TableCell>
                      <TableCell>500 triệu VND</TableCell>
                      <TableCell>6 - 60 tháng</TableCell>
                      <TableCell>Tối thiểu 8 triệu VND</TableCell>
                      <TableCell>Không yêu cầu</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BIDV</TableCell>
                      <TableCell>7.8% - 10.2%</TableCell>
                      <TableCell>600 triệu VND</TableCell>
                      <TableCell>6 - 72 tháng</TableCell>
                      <TableCell>Tối thiểu 7 triệu VND</TableCell>
                      <TableCell>Không yêu cầu</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Techcombank</TableCell>
                      <TableCell>8.0% - 9.8%</TableCell>
                      <TableCell>700 triệu VND</TableCell>
                      <TableCell>6 - 60 tháng</TableCell>
                      <TableCell>Tối thiểu 10 triệu VND</TableCell>
                      <TableCell>Không yêu cầu</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">VPBank</TableCell>
                      <TableCell>8.2% - 10.5%</TableCell>
                      <TableCell>500 triệu VND</TableCell>
                      <TableCell>6 - 60 tháng</TableCell>
                      <TableCell>Tối thiểu 8 triệu VND</TableCell>
                      <TableCell>Không yêu cầu</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">MB Bank</TableCell>
                      <TableCell>7.9% - 9.9%</TableCell>
                      <TableCell>500 triệu VND</TableCell>
                      <TableCell>6 - 60 tháng</TableCell>
                      <TableCell>Tối thiểu 7 triệu VND</TableCell>
                      <TableCell>Không yêu cầu</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mortgage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>So sánh khoản vay mua nhà</CardTitle>
                <CardDescription>
                  So sánh lãi suất và điều kiện vay mua nhà từ các ngân hàng hàng đầu Việt Nam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Cập nhật tháng 05/2025</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngân hàng</TableHead>
                      <TableHead>Lãi suất cố định ban đầu</TableHead>
                      <TableHead>Lãi suất thả nổi</TableHead>
                      <TableHead>Khoản vay tối đa</TableHead>
                      <TableHead>Thời hạn vay</TableHead>
                      <TableHead>Tỷ lệ cho vay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Vietcombank</TableCell>
                      <TableCell>6.5% trong 12 tháng</TableCell>
                      <TableCell>8.5% - 10.5%</TableCell>
                      <TableCell>70% giá trị tài sản</TableCell>
                      <TableCell>Lên đến 25 năm</TableCell>
                      <TableCell>Tối đa 70%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BIDV</TableCell>
                      <TableCell>6.8% trong 12 tháng</TableCell>
                      <TableCell>8.8% - 11.0%</TableCell>
                      <TableCell>80% giá trị tài sản</TableCell>
                      <TableCell>Lên đến 25 năm</TableCell>
                      <TableCell>Tối đa 80%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Techcombank</TableCell>
                      <TableCell>6.49% trong 12 tháng</TableCell>
                      <TableCell>8.2% - 10.2%</TableCell>
                      <TableCell>75% giá trị tài sản</TableCell>
                      <TableCell>Lên đến 35 năm</TableCell>
                      <TableCell>Tối đa 75%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">VPBank</TableCell>
                      <TableCell>7.0% trong 12 tháng</TableCell>
                      <TableCell>9.0% - 11.5%</TableCell>
                      <TableCell>70% giá trị tài sản</TableCell>
                      <TableCell>Lên đến 25 năm</TableCell>
                      <TableCell>Tối đa 70%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="business" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>So sánh khoản vay kinh doanh</CardTitle>
                <CardDescription>
                  So sánh lãi suất và điều kiện vay kinh doanh từ các ngân hàng hàng đầu Việt Nam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Cập nhật tháng 05/2025</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngân hàng</TableHead>
                      <TableHead>Lãi suất</TableHead>
                      <TableHead>Hạn mức</TableHead>
                      <TableHead>Thời hạn vay</TableHead>
                      <TableHead>Yêu cầu tài sản</TableHead>
                      <TableHead>Yêu cầu kinh doanh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Vietcombank</TableCell>
                      <TableCell>8.5% - 11.0%</TableCell>
                      <TableCell>Lên đến 10 tỷ VND</TableCell>
                      <TableCell>Lên đến 10 năm</TableCell>
                      <TableCell>Có</TableCell>
                      <TableCell>Hoạt động tối thiểu 2 năm</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BIDV</TableCell>
                      <TableCell>9.0% - 11.5%</TableCell>
                      <TableCell>Lên đến 15 tỷ VND</TableCell>
                      <TableCell>Lên đến 15 năm</TableCell>
                      <TableCell>Có</TableCell>
                      <TableCell>Hoạt động tối thiểu 2 năm</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Techcombank</TableCell>
                      <TableCell>8.7% - 11.2%</TableCell>
                      <TableCell>Lên đến 20 tỷ VND</TableCell>
                      <TableCell>Lên đến 12 năm</TableCell>
                      <TableCell>Có</TableCell>
                      <TableCell>Hoạt động tối thiểu 1 năm</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">VIB</TableCell>
                      <TableCell>9.2% - 11.8%</TableCell>
                      <TableCell>Lên đến 15 tỷ VND</TableCell>
                      <TableCell>Lên đến 10 năm</TableCell>
                      <TableCell>Có</TableCell>
                      <TableCell>Hoạt động tối thiểu 1.5 năm</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="car" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>So sánh khoản vay mua xe</CardTitle>
                <CardDescription>
                  So sánh lãi suất và điều kiện vay mua xe từ các ngân hàng hàng đầu Việt Nam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Cập nhật tháng 05/2025</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngân hàng</TableHead>
                      <TableHead>Lãi suất</TableHead>
                      <TableHead>Tỷ lệ cho vay</TableHead>
                      <TableHead>Thời hạn vay</TableHead>
                      <TableHead>Xử lý hồ sơ</TableHead>
                      <TableHead>Điều kiện</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Vietcombank</TableCell>
                      <TableCell>7.0% - 9.0%</TableCell>
                      <TableCell>Tối đa 80% xe mới</TableCell>
                      <TableCell>Đến 8 năm</TableCell>
                      <TableCell>24-48 giờ</TableCell>
                      <TableCell>Thu nhập {'>'} 10 triệu/tháng</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TPBank</TableCell>
                      <TableCell>7.2% - 9.5%</TableCell>
                      <TableCell>Tối đa 85% xe mới</TableCell>
                      <TableCell>Đến 8 năm</TableCell>
                      <TableCell>8-24 giờ</TableCell>
                      <TableCell>Thu nhập {'>'} 8 triệu/tháng</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">VPBank</TableCell>
                      <TableCell>7.5% - 10.0%</TableCell>
                      <TableCell>Tối đa 80% xe mới</TableCell>
                      <TableCell>Đến 7 năm</TableCell>
                      <TableCell>24-72 giờ</TableCell>
                      <TableCell>Thu nhập {'>'} 10 triệu/tháng</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">OCB</TableCell>
                      <TableCell>7.8% - 9.8%</TableCell>
                      <TableCell>Tối đa 90% xe mới</TableCell>
                      <TableCell>Đến 8 năm</TableCell>
                      <TableCell>24-48 giờ</TableCell>
                      <TableCell>Thu nhập {'>'} 12 triệu/tháng</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 bg-brand-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Lưu ý khi so sánh khoản vay</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Lãi suất có thể thay đổi tùy theo tình hình kinh tế và chính sách của ngân hàng.</li>
            <li>Các khoản phí khác như phí trả nợ trước hạn, phí bảo hiểm, phí hồ sơ... cũng cần được xem xét khi lựa chọn khoản vay.</li>
            <li>Điều kiện cụ thể sẽ được đánh giá dựa trên hồ sơ của từng khách hàng.</li>
            <li>Hãy sử dụng công cụ khảo sát của chúng tôi để nhận được đề xuất phù hợp với điều kiện cá nhân.</li>
          </ul>
        </div>
        
        <div className="mt-10 text-center">
          <h3 className="text-lg font-medium mb-4">Bạn cần tư vấn thêm về khoản vay phù hợp?</h3>
          <Link to="/khao-sat">
            <Button className="bg-brand-600 hover:bg-brand-700">Bắt đầu khảo sát miễn phí</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default LoanComparison;
