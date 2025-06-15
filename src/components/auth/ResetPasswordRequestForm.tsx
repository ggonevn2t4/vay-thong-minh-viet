
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

interface ResetPasswordRequestFormProps {
  onBackToSignIn: () => void;
}

export const ResetPasswordRequestForm = ({ onBackToSignIn }: ResetPasswordRequestFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/auth`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      toast.error(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } else {
      toast.success('Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Quên mật khẩu?</h3>
        <p className="text-sm text-gray-500">Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu.</p>
      </div>
      <form onSubmit={handlePasswordResetRequest} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi hướng dẫn'
          )}
        </Button>
      </form>
      <Button variant="link" className="w-full" onClick={onBackToSignIn}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại Đăng nhập
      </Button>
    </div>
  );
};

