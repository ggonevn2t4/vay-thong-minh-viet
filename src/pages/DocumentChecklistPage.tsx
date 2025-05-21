
import React from 'react';
import Layout from '@/components/layout/Layout';
import DocumentChecklist from '@/components/DocumentChecklist';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DocumentChecklistPage = () => {
  return (
    <Layout>
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Danh sách giấy tờ vay vốn</h1>
            <p className="text-lg text-gray-600 mb-6">
              Chuẩn bị đầy đủ giấy tờ cần thiết sẽ giúp hồ sơ vay vốn của bạn được xét duyệt nhanh chóng và dễ dàng hơn
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <Link to="/loan-eligibility">
                <Button variant="outline" className="flex items-center">
                  Kiểm tra khả năng vay <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <DocumentChecklist />
          
          <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Một số lưu ý quan trọng</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Về việc công chứng giấy tờ</h3>
                <p className="text-gray-600">
                  Đối với các giấy tờ yêu cầu công chứng, bạn nên làm công chứng tại các văn phòng công chứng được cấp phép.
                  Giấy tờ công chứng chỉ có giá trị trong vòng 6 tháng kể từ ngày công chứng.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Về sao kê tài khoản</h3>
                <p className="text-gray-600">
                  Sao kê tài khoản ngân hàng cần có xác nhận của ngân hàng với đầy đủ thông tin về chủ tài khoản, số tài khoản,
                  và các giao dịch. Bạn có thể yêu cầu sao kê tại quầy giao dịch hoặc in từ internet banking có đóng dấu của ngân hàng.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Về giấy tờ tài sản đảm bảo</h3>
                <p className="text-gray-600">
                  Đảm bảo giấy tờ tài sản không có tranh chấp, thế chấp hoặc kê biên. Nếu tài sản đang thế chấp ở nơi khác,
                  cần có giấy xác nhận dư nợ từ ngân hàng đang thế chấp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentChecklistPage;
