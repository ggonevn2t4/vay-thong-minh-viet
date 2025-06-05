
import Layout from '@/components/layout/Layout';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const Messages = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tin nhắn</h1>
            <p className="text-gray-600">
              Trao đổi trực tiếp với tư vấn viên và khách hàng
            </p>
          </div>
          
          <MessagingInterface />
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
