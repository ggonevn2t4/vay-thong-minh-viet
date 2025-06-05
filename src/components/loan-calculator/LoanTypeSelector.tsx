
interface LoanTypeSelectorProps {
  loanType: string;
  onLoanTypeChange: (type: string) => void;
}

const LoanTypeSelector = ({ loanType, onLoanTypeChange }: LoanTypeSelectorProps) => {
  const types = [
    { id: 'personal', name: 'Vay tiêu dùng', rate: '12-18%' },
    { id: 'mortgage', name: 'Vay mua nhà', rate: '8-12%' },
    { id: 'car', name: 'Vay mua xe', rate: '9-14%' },
    { id: 'business', name: 'Vay kinh doanh', rate: '10-15%' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {types.map((type) => (
        <div
          key={type.id}
          className={`p-3 border rounded-lg cursor-pointer transition-all ${
            loanType === type.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
          }`}
          onClick={() => onLoanTypeChange(type.id)}
        >
          <div className="font-medium">{type.name}</div>
          <div className="text-sm text-muted-foreground">Lãi suất: {type.rate}</div>
        </div>
      ))}
    </div>
  );
};

export default LoanTypeSelector;
