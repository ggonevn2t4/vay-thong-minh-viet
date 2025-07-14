
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cleanupAuthState } from '@/utils/authUtils';
import { ResetPasswordRequestForm } from '@/components/auth/ResetPasswordRequestForm';

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isResetRequest, setIsResetRequest] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Đăng nhập thành công!');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      if (error.message.includes('Email not confirmed')) {
        toast.error('Vui lòng xác nhận email của bạn trước khi đăng nhập.');
      } else {
        toast.error('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetRequest) {
    return <ResetPasswordRequestForm onBackToSignIn={() => setIsResetRequest(false)} />;
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isDisabled = isLoading || !isValidEmail(formData.email) || !formData.password || formData.password.length < 6;

  return (
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
      <div className="text-right -mt-2">
        <Button
          type="button"
          variant="link"
          size="sm"
          className="p-0 h-auto font-normal text-sm"
          onClick={() => setIsResetRequest(true)}
        >
          Quên mật khẩu?
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full rounded-lg shadow-md transition-all duration-200 font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:bg-brand-100 disabled:text-gray-400"
        disabled={isDisabled}
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
  );
};

