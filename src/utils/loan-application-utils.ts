
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { RawLoanApplicationWithProfile } from '@/types/loan-applications';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    case 'pending':
      return Clock;
    default:
      return FileText;
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Từ chối';
    case 'pending':
      return 'Chờ duyệt';
    case 'reviewing':
      return 'Đang xem xét';
    default:
      return status;
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const getCustomerName = (app: RawLoanApplicationWithProfile) => {
  return app.profiles?.full_name || 'Khách hàng';
};

export const getCustomerPhone = (app: RawLoanApplicationWithProfile) => {
  return app.profiles?.phone || 'Không có số điện thoại';
};
