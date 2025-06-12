
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/92277533-8a64-40f2-b441-187e4701f7b1.png" 
                alt="Finzy Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-semibold text-gray-900">Finzy</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Tài chính đơn giản, kết nối an toàn. Giúp bạn tìm kiếm và so sánh các khoản vay phù hợp nhất từ các ngân hàng hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-600">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600">
                <span className="sr-only">Youtube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/khao-sat" className="text-sm text-gray-600 hover:text-brand-600">
                  Khảo sát miễn phí
                </Link>
              </li>
              <li>
                <Link to="/so-sanh" className="text-sm text-gray-600 hover:text-brand-600">
                  So sánh khoản vay
                </Link>
              </li>
              <li>
                <Link to="/bao-cao" className="text-sm text-gray-600 hover:text-brand-600">
                  Báo cáo chuyên sâu
                </Link>
              </li>
              <li>
                <Link to="/tu-van" className="text-sm text-gray-600 hover:text-brand-600">
                  Tư vấn miễn phí
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/gioi-thieu" className="text-sm text-gray-600 hover:text-brand-600">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-bao-mat" className="text-sm text-gray-600 hover:text-brand-600">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/dieu-khoan-su-dung" className="text-sm text-gray-600 hover:text-brand-600">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="text-sm text-gray-600 hover:text-brand-600">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> Finzytechnology@gmail.com
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium">Điện thoại:</span> 0765080960
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium">Địa chỉ:</span> 13A4/3A KV5, Phường An Bình, Quận Ninh Kiều, TP. Cần Thơ
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium">Giờ làm việc:</span> 8:00 - 17:30, Thứ 2 - Thứ 6
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} Finzy. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
