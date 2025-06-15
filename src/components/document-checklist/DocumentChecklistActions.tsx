
import React from 'react';
import { Button } from '@/components/ui/button';

interface DocumentChecklistActionsProps {
  completedRequired: number;
  requiredCount: number;
}

export const DocumentChecklistActions = ({ completedRequired, requiredCount }: DocumentChecklistActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button 
        className="flex-1"
        disabled={completedRequired < requiredCount}
      >
        Nộp hồ sơ ({completedRequired}/{requiredCount})
      </Button>
      <Button variant="outline">
        Lưu tiến độ
      </Button>
    </div>
  );
};

