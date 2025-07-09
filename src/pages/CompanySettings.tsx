import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Building2, CreditCard, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import CompanyBankInfo from '@/components/CompanyBankInfo';

const bankAccountSchema = z.object({
  bank_name: z.string().min(1, 'Tên ngân hàng là bắt buộc'),
  account_holder_name: z.string().min(1, 'Tên chủ tài khoản là bắt buộc'),
  account_number: z.string().min(1, 'Số tài khoản là bắt buộc'),
  branch_name: z.string().optional(),
  bank_code: z.string().optional(),
  account_type: z.string().default('business'),
  currency: z.string().default('VND'),
  is_primary: z.boolean().default(false),
  notes: z.string().optional(),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

interface CompanyBankAccount {
  id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  branch_name: string | null;
  bank_code: string | null;
  account_type: string;
  currency: string;
  is_primary: boolean;
  is_active: boolean;
  notes: string | null;
}

const CompanySettings = () => {
  const { userRole } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<CompanyBankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CompanyBankAccount | null>(null);

  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bank_name: '',
      account_holder_name: '',
      account_number: '',
      branch_name: '',
      bank_code: '',
      account_type: 'business',
      currency: 'VND',
      is_primary: false,
      notes: '',
    },
  });

  useEffect(() => {
    if (userRole !== 'admin') {
      return;
    }
    fetchBankAccounts();
  }, [userRole]);

  const fetchBankAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('company_bank_accounts')
        .select('*')
        .order('is_primary', { ascending: false });

      if (error) {
        console.error('Error fetching bank accounts:', error);
        toast.error('Không thể tải thông tin tài khoản ngân hàng');
        return;
      }

      setBankAccounts(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BankAccountFormData) => {
    try {
      if (editingAccount) {
        const { error } = await supabase
          .from('company_bank_accounts')
          .update(data)
          .eq('id', editingAccount.id);

        if (error) throw error;
        toast.success('Cập nhật tài khoản ngân hàng thành công');
      } else {
        // Type assertion để đảm bảo data có đầy đủ thông tin bắt buộc
        const insertData = {
          bank_name: data.bank_name,
          account_holder_name: data.account_holder_name,
          account_number: data.account_number,
          branch_name: data.branch_name || null,
          bank_code: data.bank_code || null,
          account_type: data.account_type || 'business',
          currency: data.currency || 'VND',
          is_primary: data.is_primary || false,
          notes: data.notes || null
        };
        
        const { error } = await supabase
          .from('company_bank_accounts')
          .insert(insertData);

        if (error) throw error;
        toast.success('Thêm tài khoản ngân hàng thành công');
      }

      setIsDialogOpen(false);
      setEditingAccount(null);
      form.reset();
      fetchBankAccounts();
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast.error('Không thể lưu thông tin tài khoản ngân hàng');
    }
  };

  const handleEdit = (account: CompanyBankAccount) => {
    setEditingAccount(account);
    form.reset({
      bank_name: account.bank_name,
      account_holder_name: account.account_holder_name,
      account_number: account.account_number,
      branch_name: account.branch_name || '',
      bank_code: account.bank_code || '',
      account_type: account.account_type,
      currency: account.currency,
      is_primary: account.is_primary,
      notes: account.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('company_bank_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Xóa tài khoản ngân hàng thành công');
      fetchBankAccounts();
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast.error('Không thể xóa tài khoản ngân hàng');
    }
  };

  const toggleActiveStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('company_bank_accounts')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công`);
      fetchBankAccounts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  if (userRole !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
              <p className="text-gray-600">Chỉ quản trị viên mới có thể truy cập trang này.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt công ty</h1>
          <p className="text-gray-600">Quản lý thông tin ngân hàng và cài đặt công ty</p>
        </div>

        <div className="grid gap-8">
          {/* Company Bank Accounts Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Tài khoản ngân hàng công ty
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingAccount(null);
                        form.reset();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm tài khoản
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAccount ? 'Chỉnh sửa' : 'Thêm'} tài khoản ngân hàng
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="bank_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên ngân hàng</FormLabel>
                              <FormControl>
                                <Input placeholder="VD: Ngân hàng Sacombank" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="account_holder_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên chủ tài khoản</FormLabel>
                              <FormControl>
                                <Input placeholder="VD: Công Ty Cổ Phần Công Nghệ Finzy" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="account_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số tài khoản</FormLabel>
                              <FormControl>
                                <Input placeholder="VD: 9269" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="branch_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chi nhánh</FormLabel>
                              <FormControl>
                                <Input placeholder="VD: Chi Nhánh Sài Gòn Thương Tín" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="is_primary"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Tài khoản chính</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                  Đây là tài khoản chính của công ty
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ghi chú</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Ghi chú thêm về tài khoản..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-2 pt-4">
                          <Button type="submit">
                            {editingAccount ? 'Cập nhật' : 'Thêm'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Hủy
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : bankAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có tài khoản ngân hàng nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <Card key={account.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{account.bank_name}</h3>
                              <div className="flex gap-1">
                                {account.is_primary && (
                                  <Badge variant="default" className="text-xs">Chính</Badge>
                                )}
                                <Badge 
                                  variant={account.is_active ? "default" : "secondary"} 
                                  className="text-xs"
                                >
                                  {account.is_active ? 'Hoạt động' : 'Tạm dừng'}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Chủ TK:</strong> {account.account_holder_name}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Số TK:</strong> {account.account_number}
                            </p>
                            {account.branch_name && (
                              <p className="text-sm text-gray-600">
                                <strong>Chi nhánh:</strong> {account.branch_name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={account.is_active}
                                onCheckedChange={(checked) => toggleActiveStatus(account.id, checked)}
                              />
                              <Label className="text-xs">Hoạt động</Label>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(account)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(account.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước thông tin hiển thị</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyBankInfo />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CompanySettings;