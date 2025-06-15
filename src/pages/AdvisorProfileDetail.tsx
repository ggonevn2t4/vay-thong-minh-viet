
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdvisorProfileDetails from '@/components/advisor/AdvisorProfileDetails';

const AdvisorProfileDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lỗi</h1>
          <p className="text-gray-600">Không tìm thấy ID tư vấn viên.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <AdvisorProfileDetails advisorId={id} />
      </div>
    </Layout>
  );
};

export default AdvisorProfileDetailPage;
