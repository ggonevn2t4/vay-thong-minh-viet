
import Layout from '@/components/layout/Layout';
import EnhancedAdvisorDirectory from '@/components/advisor/EnhancedAdvisorDirectory';

const AdvisorDirectoryPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Danh sách tư vấn viên
            </h1>
            <p className="text-xl text-gray-600">
              Kết nối với các chuyên gia tư vấn tài chính hàng đầu
            </p>
          </div>
          <EnhancedAdvisorDirectory />
        </div>
      </div>
    </Layout>
  );
};

export default AdvisorDirectoryPage;
