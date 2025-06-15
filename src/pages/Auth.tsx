
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

const Auth = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Chào mừng đến với VayThôngMinh
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Nền tảng so sánh và tư vấn khoản vay thông minh
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Xác thực tài khoản</CardTitle>
              <CardDescription>
                Đăng nhập hoặc tạo tài khoản mới để bắt đầu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
                  <TabsTrigger value="signup">Đăng ký</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="pt-4">
                  <SignInForm />
                </TabsContent>

                <TabsContent value="signup" className="pt-4">
                  <SignUpForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
