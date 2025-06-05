
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface LoanResultsProps {
  loanResult: {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  };
  schedule: any[];
}

const LoanResults = ({ loanResult, schedule }: LoanResultsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Trả hàng tháng</div>
          <div className="text-lg font-bold">{formatCurrency(loanResult.monthlyPayment)} đ</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Tổng tiền lãi</div>
          <div className="text-lg font-bold">{formatCurrency(loanResult.totalInterest)} đ</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Tổng số tiền phải trả</div>
          <div className="text-lg font-bold">{formatCurrency(loanResult.totalPayment)} đ</div>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">Xem lịch trả nợ</Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: '600px', maxWidth: '90vw' }}>
          <div className="p-4 border-b">
            <h3 className="font-semibold">Lịch trả nợ ước tính</h3>
            <p className="text-sm text-muted-foreground">5 kỳ trả nợ đầu tiên</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kỳ</TableHead>
                <TableHead>Gốc phải trả</TableHead>
                <TableHead>Lãi phải trả</TableHead>
                <TableHead>Tổng phải trả</TableHead>
                <TableHead>Dư nợ gốc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((month) => (
                <TableRow key={month.month}>
                  <TableCell>{month.month}</TableCell>
                  <TableCell>{formatCurrency(month.principalPayment)} đ</TableCell>
                  <TableCell>{formatCurrency(month.interestPayment)} đ</TableCell>
                  <TableCell>{formatCurrency(month.totalPayment)} đ</TableCell>
                  <TableCell>{formatCurrency(month.remainingPrincipal)} đ</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-3 text-center border-t">
            <p className="text-sm text-muted-foreground">
              Đây là ước tính ban đầu. Số tiền thực tế có thể thay đổi.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LoanResults;
