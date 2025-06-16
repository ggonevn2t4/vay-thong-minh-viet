
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RawLoanApplicationWithProfile } from '@/types/loan-applications';
import { getStatusIcon, getStatusText, formatCurrency, getCustomerName, getCustomerPhone } from '@/utils/loan-application-utils';

interface LoanApplicationCardProps {
  application: RawLoanApplicationWithProfile;
  onClick: (app: RawLoanApplicationWithProfile) => void;
}

const LoanApplicationCard = ({ application, onClick }: LoanApplicationCardProps) => {
  const StatusIcon = getStatusIcon(application.status);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(application)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium">{getCustomerName(application)}</p>
            <p className="text-sm text-gray-600">{getCustomerPhone(application)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4 text-gray-500" />
            <Badge variant="outline">{getStatusText(application.status)}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Số tiền:</span>
            <p className="font-medium">{formatCurrency(application.amount)}</p>
          </div>
          <div>
            <span className="text-gray-500">Thời hạn:</span>
            <p className="font-medium">{application.term_months} tháng</p>
          </div>
          <div>
            <span className="text-gray-500">Loại vay:</span>
            <p className="font-medium">{application.loan_type}</p>
          </div>
          <div>
            <span className="text-gray-500">Thu nhập:</span>
            <p className="font-medium">
              {application.monthly_income ? `${formatCurrency(application.monthly_income)}/tháng` : 'Chưa cung cấp'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationCard;
