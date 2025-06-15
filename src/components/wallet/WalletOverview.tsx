
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Wallet, Star } from "lucide-react";

const fetchWalletData = async (userId: string) => {
  const { data, error } = await supabase
    .from("wallet")
    .select("balance, points_balance")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found, so wallet likely not created yet.
      return { balance: 0, points_balance: 0 };
    }
    throw new Error(error.message);
  }
  return data;
};

const WalletOverview = () => {
  const { user } = useAuth();
  const { data: wallet, isLoading, error } = useQuery({
    queryKey: ["wallet", user?.id],
    queryFn: () => {
      if (!user) throw new Error("User not authenticated");
      return fetchWalletData(user.id);
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Lỗi: {error.message}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Số dư chính</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wallet?.balance || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Số dư trong ví tiền mặt của bạn</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Điểm thưởng</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wallet?.points_balance || 0}</div>
          <p className="text-xs text-muted-foreground">Sử dụng điểm để thanh toán dịch vụ</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletOverview;
