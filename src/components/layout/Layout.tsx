
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from '../Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Chatbot initialMessage="Xin chào! Tôi là trợ lý ảo của VayThôngMinh. Tôi có thể giúp gì cho bạn?" />
    </div>
  );
};

export default Layout;
