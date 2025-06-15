
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const fetchTransactions = async (userId: string) => {
    const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (error) throw new Error(error.message);
    return data;
};

const PointsTransactions = () => {
    const { user } = useAuth();
    const { data: transactions, isLoading, error } = useQuery({
        queryKey: ['pointsTransactions', user?.id],
        queryFn: () => {
            if (!user) throw new Error("User not authenticated");
            return fetchTransactions(user.id);
        },
        enabled: !!user,
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lịch sử điểm thưởng</CardTitle>
                <CardDescription>20 giao dịch gần nhất của bạn.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {error && (
                    <div className="text-red-500 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Lỗi: {error.message}
                    </div>
                )}
                {transactions && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead>Mô tả</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        Không có giao dịch nào.
                                    </TableCell>
                                </TableRow>
                            )}
                            {transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{format(new Date(tx.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>
                                        <Badge variant={tx.type === 'purchase' ? 'default' : 'secondary'}>{tx.type}</Badge>
                                    </TableCell>
                                    <TableCell className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default PointsTransactions;
