
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Assuming 1,000 VND = 1 point
const CONVERSION_RATE = 1000;

const purchasePoints = async ({ userId, pointsToBuy, amountInVnd }: { userId: string, pointsToBuy: number, amountInVnd: number }) => {
    console.warn("DANGER: This operation is NOT transactionally safe and should be converted to a backend function (RPC or Edge Function) for production use to prevent data inconsistencies.");

    const { data: wallet, error: walletError } = await supabase
        .from('wallet')
        .select('id, balance, points_balance')
        .eq('user_id', userId)
        .single();
    
    if (walletError) throw new Error(`Could not fetch wallet: ${walletError.message}`);
    if (!wallet) throw new Error('Wallet not found for this user.');
    if (wallet.balance < amountInVnd) throw new Error('Insufficient balance.');

    const newBalance = wallet.balance - amountInVnd;
    const newPointsBalance = wallet.points_balance + pointsToBuy;

    const { error: updateWalletError } = await supabase
        .from('wallet')
        .update({
            balance: newBalance,
            points_balance: newPointsBalance
        })
        .eq('id', wallet.id);

    if (updateWalletError) {
        // In a real transactional function, we would roll back the changes.
        // Here we can't, which is why this is unsafe.
        throw new Error(`Failed to update wallet: ${updateWalletError.message}`);
    }

    // Log transactions. We'll proceed even if these fail to not block the user,
    // but this highlights the need for a proper transaction.
    await Promise.all([
        supabase.from('wallet_transactions').insert({
            wallet_id: wallet.id,
            amount: -amountInVnd,
            transaction_type: 'points_purchase',
            status: 'completed',
            description: `Mua ${pointsToBuy} điểm`
        }),
        supabase.from('points_transactions').insert({
            user_id: userId,
            type: 'purchase',
            amount: pointsToBuy,
            description: 'Mua điểm từ ví'
        })
    ]).catch(err => console.error("CRITICAL: Failed to log transactions after wallet update:", err));

    return { success: true };
};

const PurchasePointsForm = () => {
  const [points, setPoints] = useState(100);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: purchasePoints,
    onSuccess: () => {
        toast.success("Mua điểm thành công!");
        queryClient.invalidateQueries({ queryKey: ["wallet", user?.id] });
        queryClient.invalidateQueries({ queryKey: ["pointsTransactions", user?.id] });
        setPoints(100);
    },
    onError: (error) => {
        toast.error(`Mua điểm thất bại: ${error.message}`);
    }
  });

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.error("Bạn cần đăng nhập để mua điểm.");
        return;
    }
    if (points <= 0) {
        toast.error("Số điểm mua phải lớn hơn 0.");
        return;
    }

    mutation.mutate({ 
        userId: user.id, 
        pointsToBuy: points, 
        amountInVnd: points * CONVERSION_RATE 
    });
  };

  const amount = points * CONVERSION_RATE;

  return (
    <Card>
      <form onSubmit={handlePurchase}>
        <CardHeader>
          <CardTitle>Mua điểm thưởng</CardTitle>
          <CardDescription>
            Chuyển đổi tiền trong ví thành điểm thưởng. Tỷ giá: 1,000 VND = 1 điểm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="points">Số điểm muốn mua</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              min="1"
              disabled={mutation.isPending}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Thành tiền:{" "}
            <span className="font-bold text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(amount)}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận mua điểm"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PurchasePointsForm;
