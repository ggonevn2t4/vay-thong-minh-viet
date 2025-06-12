
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';

interface ExistingLoan {
  id: string;
  bank_name: string;
  remaining_amount: number;
  promotional_rate?: number;
  promotional_end_date?: string;
  post_promotional_rate?: number;
  remaining_term_months: number;
  has_promotional_period?: boolean;
}

interface PromotionalCostAlertProps {
  loan: ExistingLoan;
}

interface CostCalculation {
  days_remaining: number;
  current_rate: number;
  future_rate: number;
  monthly_increase: number;
  total_increase: number;
  promotional_end_date: string;
}

const PromotionalCostAlert = ({ loan }: PromotionalCostAlertProps) => {
  const [costData, setCostData] = useState<CostCalculation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loan.has_promotional_period) {
      calculatePromotionalCosts();
    } else {
      setLoading(false);
    }
  }, [loan.id]);

  const calculatePromotionalCosts = async () => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_promotional_cost_increase', { loan_id: loan.id });

      if (error) throw error;
      
      // Handle the response properly - check if it's an error response
      if (data && typeof data === 'object' && !Array.isArray(data) && 'error' in data) {
        console.log('No promotional data available:', data.error);
        setCostData(null);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Safely convert the data by checking required properties
        const responseData = data as Record<string, any>;
        if (
          typeof responseData.days_remaining === 'number' &&
          typeof responseData.current_rate === 'number' &&
          typeof responseData.future_rate === 'number' &&
          typeof responseData.monthly_increase === 'number' &&
          typeof responseData.total_increase === 'number' &&
          typeof responseData.promotional_end_date === 'string'
        ) {
          const calculationData: CostCalculation = {
            days_remaining: responseData.days_remaining,
            current_rate: responseData.current_rate,
            future_rate: responseData.future_rate,
            monthly_increase: responseData.monthly_increase,
            total_increase: responseData.total_increase,
            promotional_end_date: responseData.promotional_end_date
          };
          setCostData(calculationData);
        } else {
          console.log('Invalid data structure received from promotional cost calculation');
          setCostData(null);
        }
      } else {
        setCostData(null);
      }
    } catch (error) {
      console.error('Error calculating promotional costs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!costData || costData.days_remaining <= 0) {
    return null;
  }

  const getAlertVariant = () => {
    if (costData.days_remaining <= 7) return 'destructive';
    if (costData.days_remaining <= 30) return 'default';
    return 'default';
  };

  const getAlertIcon = () => {
    if (costData.days_remaining <= 7) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <Alert variant={getAlertVariant()} className="mt-4">
      {getAlertIcon()}
      <AlertDescription>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              Giai đoạn ưu đãi còn {costData.days_remaining} ngày
            </span>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              Sắp hết ưu đãi
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Lãi suất hiện tại:</span>
              <div className="font-semibold text-green-600">
                {costData.current_rate}%/năm
              </div>
            </div>
            <div>
              <span className="text-gray-600">Lãi suất sau ưu đãi:</span>
              <div className="font-semibold text-red-600">
                {costData.future_rate}%/năm
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-gray-600">Tăng hàng tháng:</span>
              <span className="font-semibold text-red-600">
                +{formatCurrency(costData.monthly_increase)} đ
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Tổng chi phí tăng thêm: {formatCurrency(costData.total_increase)} đ
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Kết thúc ưu đãi: {new Date(costData.promotional_end_date).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PromotionalCostAlert;
