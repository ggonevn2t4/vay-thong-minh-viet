
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from '../Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component that wraps all pages
 * Provides consistent header, footer, and chatbot across the application
 * @param {LayoutProps} props - The component props
 * @param {React.ReactNode} props.children - The page content to render
 * @returns {JSX.Element} The complete layout structure
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Chatbot initialMessage="Xin chào! Tôi là trợ lý ảo của VayThôngMinh. Tôi có thể giúp gì cho bạn?" />
    </div>
  );
};

export default Layout;
