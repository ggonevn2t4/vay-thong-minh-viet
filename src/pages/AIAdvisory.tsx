
import Layout from '@/components/layout/Layout';
import AIAdvisorySystem from '@/components/AIAdvisorySystem';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const AIAdvisory = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <AIAdvisorySystem />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AIAdvisory;
