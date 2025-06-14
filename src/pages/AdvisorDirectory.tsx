
import Layout from '@/components/layout/Layout';
import AdvisorDirectory from '@/components/marketplace/AdvisorDirectory';

const AdvisorDirectoryPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <AdvisorDirectory />
        </div>
      </div>
    </Layout>
  );
};

export default AdvisorDirectoryPage;
