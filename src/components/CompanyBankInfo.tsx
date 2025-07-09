import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CreditCard, MapPin, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

interface CompanyBankInfoProps {
  showTitle?: boolean;
  compact?: boolean;
}

const CompanyBankInfo: React.FC<CompanyBankInfoProps> = ({ 
  showTitle = true, 
  compact = false 
}) => {
  const [bankAccounts, setBankAccounts] = useState<CompanyBankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('company_bank_accounts')
        .select('*')
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (error) {
        console.error('Error fetching bank accounts:', error);
        return;
      }

      setBankAccounts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`Đã sao chép ${fieldName}`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Không thể sao chép');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (bankAccounts.length === 0) {
    return null;
  }

  const primaryAccount = bankAccounts.find(account => account.is_primary) || bankAccounts[0];

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-brand-600" />
          <span className="font-medium">{primaryAccount.bank_name}</span>
        </div>
        <div className="text-sm text-gray-600">
          <p><strong>Chủ tài khoản:</strong> {primaryAccount.account_holder_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span><strong>Số tài khoản:</strong> {primaryAccount.account_number}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(primaryAccount.account_number, 'số tài khoản')}
              className="h-6 w-6 p-0"
            >
              {copiedField === primaryAccount.account_number ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          {primaryAccount.branch_name && (
            <p><strong>Chi nhánh:</strong> {primaryAccount.branch_name}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-brand-600" />
          Thông tin thanh toán
        </h3>
      )}
      
      <div className="grid gap-4">
        {bankAccounts.map((account) => (
          <Card key={account.id} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-600" />
                  {account.bank_name}
                </CardTitle>
                <div className="flex gap-2">
                  {account.is_primary && (
                    <Badge variant="default" className="bg-brand-100 text-brand-700">
                      Chính
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {account.currency}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Chủ tài khoản
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {account.account_holder_name}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Số tài khoản
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {account.account_number}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.account_number, 'số tài khoản')}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === account.account_number ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              {account.branch_name && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Chi nhánh
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      {account.branch_name}
                    </p>
                  </div>
                </div>
              )}
              
              {account.notes && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">{account.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyBankInfo;