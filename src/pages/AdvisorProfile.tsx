
import Layout from '@/components/layout/Layout';
import AdvisorProfileForm from '@/components/advisor/AdvisorProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdvisorProfile = () => {
  const { user, userRole } = useAuth();

  // Redirect if not an advisor
  if (user && userRole !== 'advisor') {
    return <Navigate to="/" replace />;
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <AdvisorProfileForm />
        </div>
      </div>
    </Layout>
  );
};

export default AdvisorProfile;
