
import React from 'react';
import Layout from '@/components/layout/Layout';
import EnhancedMessagingInterface from '@/components/messaging/EnhancedMessagingInterface';

/**
 * Messages page component that displays the messaging interface
 * Allows users to chat with advisors about their loan applications
 * @returns {JSX.Element} The complete messages page layout
 */
const Messages = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tin nhắn</h1>
          <p className="text-gray-600">
            Liên hệ trực tiếp với tư vấn viên để được hỗ trợ về nhu cầu vay vốn
          </p>
        </div>
        
        <EnhancedMessagingInterface />
      </div>
    </Layout>
  );
};

export default Messages;
