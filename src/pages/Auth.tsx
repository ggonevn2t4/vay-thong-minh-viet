
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import RoleSelector from '@/components/auth/RoleSelector';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'advisor'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.fullName,
            role: selectedRole
          }
        }
      });

      if (error) throw error;

      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
    } catch (error: any) {
      toast.error(error.message || 'Đã xảy ra lỗi khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Đăng nhập thành công!');
        
        // Get user role to redirect appropriately
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        // Redirect based on role
        if (roleData?.role === 'admin') {
          navigate('/admin');
        } else if (roleData?.role === 'advisor') {
          navigate('/advisor');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

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

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Mật khẩu</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang đăng nhập...
                        </>
                      ) : (
                        'Đăng nhập'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <RoleSelector 
                      selectedRole={selectedRole}
                      onRoleChange={setSelectedRole}
                    />
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Họ và tên</Label>
                      <Input
                        id="signup-name"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mật khẩu</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          minLength={6}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Mật khẩu phải có ít nhất 6 ký tự
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang tạo tài khoản...
                        </>
                      ) : (
                        `Tạo tài khoản ${selectedRole === 'advisor' ? 'Tư vấn viên' : 'Khách hàng'}`
                      )}
                    </Button>
                  </form>
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
