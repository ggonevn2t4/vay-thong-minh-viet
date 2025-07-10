
import Layout from '@/components/layout/Layout';
import EnhancedUserDashboard from '@/components/dashboard/enhanced/EnhancedUserDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const UserDashboard = () => {

  return (
    <ProtectedRoute requiredRole="customer">
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EnhancedUserDashboard />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserDashboard;
