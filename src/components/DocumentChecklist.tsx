import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, FileCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Define document types for each loan category
type DocumentItem = {
  name: string;
  description: string;
  required: boolean;
  examples?: string[];
};

type DocumentCategory = {
  title: string;
  documents: DocumentItem[];
};

const DocumentChecklist = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  
  // Personal loan documents
  const personalLoanDocuments: DocumentCategory[] = [
    {
      title: "Giấy tờ cá nhân",
      documents: [
        {
          name: "CMND/CCCD",
          description: "Chứng minh nhân dân hoặc căn cước công dân còn hiệu lực",
          required: true,
          examples: ["Bản gốc có thể đọc rõ thông tin", "Không bị mờ, rách", "Còn hiệu lực sử dụng"]
        },
        {
          name: "Hộ khẩu/KT3",
          description: "Sổ hộ khẩu hoặc giấy xác nhận cư trú",
          required: true,
          examples: ["Bản gốc hoặc công chứng", "Thông tin cư trú hiện tại"]
        },
        {
          name: "Giấy đăng ký kết hôn",
          description: "Giấy đăng ký kết hôn (nếu đã kết hôn)",
          required: false,
          examples: ["Bản gốc hoặc công chứng", "Cung cấp nếu ngân hàng yêu cầu"]
        }
      ]
    },
    {
      title: "Giấy tờ thu nhập",
      documents: [
        {
          name: "Hợp đồng lao động",
          description: "Hợp đồng lao động hiện tại",
          required: true,
          examples: ["Còn hiệu lực", "Có đầy đủ thông tin về lương, thưởng"]
        },
        {
          name: "Sao kê lương",
          description: "Sao kê tài khoản nhận lương 3-6 tháng gần nhất",
          required: true,
          examples: ["Sao kê có xác nhận của ngân hàng", "Thể hiện giao dịch nhận lương định kỳ"]
        },
        {
          name: "Xác nhận thu nhập",
          description: "Giấy xác nhận thu nhập từ đơn vị công tác",
          required: false,
          examples: ["Có chữ ký, con dấu của công ty", "Ghi rõ mức thu nhập hiện tại"]
        }
      ]
    },
    {
      title: "Giấy tờ bảo đảm (nếu có)",
      documents: [
        {
          name: "Cavet xe",
          description: "Giấy đăng ký xe (nếu thế chấp xe)",
          required: false,
          examples: ["Bản gốc", "Đứng tên người vay hoặc vợ/chồng"]
        },
        {
          name: "Sổ tiết kiệm",
          description: "Sổ tiết kiệm để thế chấp hoặc cầm cố",
          required: false,
          examples: ["Bản gốc", "Còn hiệu lực", "Không đang cầm cố nơi khác"]
        }
      ]
    }
  ];
  
  // Home loan documents
  const homeLoanDocuments: DocumentCategory[] = [
    {
      title: "Giấy tờ cá nhân",
      documents: [
        {
          name: "CMND/CCCD",
          description: "Chứng minh nhân dân hoặc căn cước công dân còn hiệu lực",
          required: true,
          examples: ["Bản gốc có thể đọc rõ thông tin", "Không bị mờ, rách", "Còn hiệu lực sử dụng"]
        },
        {
          name: "Hộ khẩu/KT3",
          description: "Sổ hộ khẩu hoặc giấy xác nhận cư trú",
          required: true,
          examples: ["Bản gốc hoặc công chứng", "Thông tin cư trú hiện tại"]
        },
        {
          name: "Giấy đăng ký kết hôn",
          description: "Giấy đăng ký kết hôn (nếu đã kết hôn)",
          required: true,
          examples: ["Bản gốc hoặc công chứng", "Đối với người đã kết hôn"]
        }
      ]
    },
    {
      title: "Giấy tờ thu nhập",
      documents: [
        {
          name: "Hợp đồng lao động",
          description: "Hợp đồng lao động hiện tại",
          required: true,
          examples: ["Còn hiệu lực", "Có đầy đủ thông tin về lương, thưởng"]
        },
        {
          name: "Sao kê lương",
          description: "Sao kê tài khoản nhận lương 6-12 tháng gần nhất",
          required: true,
          examples: ["Sao kê có xác nhận của ngân hàng", "Thể hiện giao dịch nhận lương định kỳ"]
        },
        {
          name: "Xác nhận thu nhập",
          description: "Giấy xác nhận thu nhập từ đơn vị công tác",
          required: true,
          examples: ["Có chữ ký, con dấu của công ty", "Ghi rõ mức thu nhập hiện tại"]
        },
        {
          name: "Báo cáo thuế",
          description: "Báo cáo thuế cá nhân (nếu có)",
          required: false,
          examples: ["Tờ khai thuế thu nhập cá nhân", "Biên lai nộp thuế"]
        }
      ]
    },
    {
      title: "Giấy tờ nhà đất",
      documents: [
        {
          name: "Sổ đỏ/Sổ hồng",
          description: "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà",
          required: true,
          examples: ["Bản gốc", "Không có tranh chấp", "Còn hiệu lực"]
        },
        {
          name: "Hợp đồng mua bán",
          description: "Hợp đồng mua bán nhà đất (nếu mua nhà)",
          required: true,
          examples: ["Công chứng đầy đủ", "Hợp pháp theo quy định"]
        },
        {
          name: "Giấy phép xây dựng",
          description: "Giấy phép xây dựng (nếu xây nhà mới)",
          required: false,
          examples: ["Bản gốc hoặc công chứng", "Còn hiệu lực"]
        }
      ]
    }
  ];
  
  // Business loan documents
  const businessLoanDocuments: DocumentCategory[] = [
    {
      title: "Giấy tờ cá nhân",
      documents: [
        {
          name: "CMND/CCCD",
          description: "Chứng minh nhân dân hoặc căn cước công dân của chủ doanh nghiệp",
          required: true,
          examples: ["Bản gốc có thể đọc rõ thông tin", "Không bị mờ, rách", "Còn hiệu lực sử dụng"]
        },
        {
          name: "Hộ khẩu/KT3",
          description: "Sổ hộ khẩu hoặc giấy xác nhận cư trú",
          required: true,
          examples: ["Bản gốc hoặc công chứng", "Thông tin cư trú hiện tại"]
        }
      ]
    },
    {
      title: "Giấy tờ doanh nghiệp",
      documents: [
        {
          name: "Giấy phép kinh doanh",
          description: "Giấy phép đăng ký kinh doanh/Giấy phép đầu tư",
          required: true,
          examples: ["Còn hiệu lực", "Đã đăng ký với cơ quan thuế"]
        },
        {
          name: "Điều lệ công ty",
          description: "Điều lệ công ty và các văn bản sửa đổi, bổ sung (nếu có)",
          required: true,
          examples: ["Bản gốc hoặc công chứng", "Có chữ ký các thành viên góp vốn"]
        },
        {
          name: "Nghị quyết",
          description: "Nghị quyết của HĐQT/HĐTV về việc vay vốn",
          required: true,
          examples: ["Có chữ ký của các thành viên", "Ghi rõ mục đích vay, số tiền"]
        }
      ]
    },
    {
      title: "Giấy tờ tài chính",
      documents: [
        {
          name: "Báo cáo tài chính",
          description: "Báo cáo tài chính 2-3 năm gần nhất",
          required: true,
          examples: ["Có xác nhận của cơ quan thuế", "Có chữ ký của kế toán trưởng"]
        },
        {
          name: "Sao kê ngân hàng",
          description: "Sao kê tài khoản doanh nghiệp 6-12 tháng gần nhất",
          required: true,
          examples: ["Có xác nhận của ngân hàng", "Thể hiện dòng tiền hoạt động"]
        },
        {
          name: "Tờ khai thuế",
          description: "Tờ khai thuế GTGT, thuế TNDN gần nhất",
          required: true,
          examples: ["Có xác nhận của cơ quan thuế", "Đã nộp đầy đủ"]
        },
        {
          name: "Hợp đồng kinh tế",
          description: "Các hợp đồng kinh tế đang thực hiện",
          required: false,
          examples: ["Các hợp đồng lớn", "Còn hiệu lực"]
        }
      ]
    },
    {
      title: "Giấy tờ tài sản đảm bảo",
      documents: [
        {
          name: "Giấy tờ tài sản",
          description: "Giấy tờ sở hữu tài sản thế chấp",
          required: true,
          examples: ["Sổ đỏ, sổ hồng", "Cavet xe", "Giấy tờ máy móc thiết bị"]
        },
        {
          name: "Định giá tài sản",
          description: "Chứng thư thẩm định giá tài sản (nếu có)",
          required: false,
          examples: ["Do công ty thẩm định giá độc lập cấp", "Còn hiệu lực"]
        }
      ]
    }
  ];
  
  const renderDocumentTable = (categories: DocumentCategory[]) => {
    return categories.map((category, index) => (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">{category.title}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Tên giấy tờ</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-[100px] text-center">Bắt buộc</TableHead>
              <TableHead className="w-[100px] text-center">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.documents.map((doc, docIndex) => (
              <TableRow key={docIndex}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.description}</TableCell>
                <TableCell className="text-center">
                  {doc.required ? (
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-gray-500">Không</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {isMobile ? (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedDocument(doc)}
                        >
                          Xem
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{doc.name}</DrawerTitle>
                          <DrawerDescription>{doc.description}</DrawerDescription>
                        </DrawerHeader>
                        <div className="px-4 py-2">
                          <h4 className="font-medium mb-2">Yêu cầu:</h4>
                          {doc.examples && doc.examples.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {doc.examples.map((example, i) => (
                                <li key={i}>{example}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">Không có yêu cầu đặc biệt</p>
                          )}
                        </div>
                        <DrawerFooter>
                          <DrawerClose asChild>
                            <Button variant="outline">Đóng</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedDocument(doc)}
                        >
                          Xem
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{doc.name}</DialogTitle>
                          <DialogDescription>{doc.description}</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <h4 className="font-medium mb-2">Yêu cầu:</h4>
                          {doc.examples && doc.examples.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {doc.examples.map((example, i) => (
                                <li key={i}>{example}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">Không có yêu cầu đặc biệt</p>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Đã lưu vào danh sách",
                                description: "Giấy tờ đã được thêm vào danh sách cần chuẩn bị",
                              });
                            }}
                          >
                            Lưu vào danh sách
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ));
  };
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="mb-6">
        <CardHeader className="bg-brand-50">
          <div className="flex items-center space-x-2">
            <FileCheck className="h-6 w-6 text-brand-600" />
            <CardTitle className="text-2xl text-brand-700">Danh sách giấy tờ vay vốn</CardTitle>
          </div>
          <CardDescription>
            Tổng hợp các giấy tờ cần thiết cho từng loại khoản vay tại các ngân hàng đối tác
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Vay tiêu dùng</TabsTrigger>
              <TabsTrigger value="home">Vay mua nhà</TabsTrigger>
              <TabsTrigger value="business">Vay kinh doanh</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Lưu ý khi chuẩn bị hồ sơ vay tiêu dùng:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Tất cả các giấy tờ cần được chuẩn bị bản gốc hoặc công chứng theo yêu cầu</li>
                  <li>Các giấy tờ cần còn hiệu lực tại thời điểm nộp hồ sơ</li>
                  <li>Sao kê lương tối thiểu 3 tháng gần nhất để tăng khả năng được duyệt</li>
                </ul>
              </div>
              {renderDocumentTable(personalLoanDocuments)}
            </TabsContent>
            <TabsContent value="home" className="mt-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Lưu ý khi chuẩn bị hồ sơ vay mua nhà:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Giấy tờ nhà đất cần được kiểm tra kỹ về tính pháp lý</li>
                  <li>Chuẩn bị đầy đủ hồ sơ thu nhập tối thiểu 6 tháng gần nhất</li>
                  <li>Đối với vợ chồng, cả hai người cần chuẩn bị đầy đủ giấy tờ</li>
                </ul>
              </div>
              {renderDocumentTable(homeLoanDocuments)}
            </TabsContent>
            <TabsContent value="business" className="mt-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Lưu ý khi chuẩn bị hồ sơ vay kinh doanh:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Báo cáo tài chính cần được xác nhận bởi cơ quan thuế hoặc kiểm toán</li>
                  <li>Phương án kinh doanh cần chi tiết và khả thi</li>
                  <li>Giấy tờ tài sản đảm bảo cần được định giá bởi đơn vị chuyên nghiệp</li>
                </ul>
              </div>
              {renderDocumentTable(businessLoanDocuments)}
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col md:flex-row justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Tải xuống danh sách",
                  description: "Đã bắt đầu tải xuống danh sách giấy tờ dạng PDF",
                });
              }}
            >
              Tải xuống danh sách giấy tờ (PDF)
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Đăng ký tư vấn thành công",
                  description: "Chuyên viên tư vấn sẽ liên hệ hỗ trợ bạn chuẩn bị hồ sơ",
                });
              }}
            >
              Đăng ký tư vấn hỗ trợ chuẩn bị hồ sơ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentChecklist;
