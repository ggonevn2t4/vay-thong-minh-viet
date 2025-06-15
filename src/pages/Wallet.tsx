
import Layout from "@/components/layout/Layout";
import WalletOverview from "@/components/wallet/WalletOverview";
import PurchasePointsForm from "@/components/wallet/PurchasePointsForm";
import PointsTransactions from "@/components/wallet/PointsTransactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WalletPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Ví của tôi</h1>
          <p className="text-muted-foreground">Quản lý số dư và điểm thưởng của bạn.</p>
        </div>
        
        <WalletOverview />

        <Tabs defaultValue="purchase" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">Mua điểm</TabsTrigger>
            <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
          </TabsList>
          <TabsContent value="purchase" className="mt-4">
            <PurchasePointsForm />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <PointsTransactions />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WalletPage;
