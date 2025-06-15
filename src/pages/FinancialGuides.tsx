
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const FinancialGuidesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex items-center gap-4">
          <BookOpen className="h-10 w-10 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold">Kiến thức tài chính</h1>
            <p className="text-muted-foreground">
              Hướng dẫn và bài viết giúp bạn đưa ra quyết định tài chính thông minh.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sắp ra mắt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nội dung cho trang kiến thức tài chính đang được xây dựng. Vui lòng quay lại sau!
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FinancialGuidesPage;
