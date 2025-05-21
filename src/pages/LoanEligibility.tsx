
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoanEligibilityChecker from '@/components/LoanEligibilityChecker';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LoanEligibility = () => {
  return (
    <Layout>
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Kiểm tra khả năng vay vốn</h1>
            <p className="text-lg text-gray-600 mb-6">
              Đánh giá nhanh khả năng được phê duyệt khoản vay của bạn dựa trên các yếu tố tài chính cơ bản
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <Link to="/document-checklist">
                <Button variant="outline" className="flex items-center">
                  Xem danh sách giấy tờ cần thiết <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <LoanEligibilityChecker />
          
          <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Các yếu tố ảnh hưởng đến khả năng vay vốn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Yếu tố tích cực</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Thu nhập ổn định và cao</li>
                  <li>Lịch sử tín dụng tốt</li>
                  <li>Công việc ổn định lâu dài</li>
                  <li>Tài sản đảm bảo giá trị cao</li>
                  <li>Có khoản tiết kiệm</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Yếu tố tiêu cực</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Nhiều khoản nợ hiện tại</li>
                  <li>Lịch sử trả nợ không tốt</li>
                  <li>Thu nhập thấp hoặc không ổn định</li>
                  <li>Thời gian làm việc ngắn</li>
                  <li>Không có tài sản đảm bảo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanEligibility;
