
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText } from 'lucide-react';

interface DocumentChecklistOverviewProps {
  completedRequired: number;
  requiredCount: number;
  progress: number;
  completedCount: number;
  totalUploaded: number;
}

export const DocumentChecklistOverview = ({
  completedRequired,
  requiredCount,
  progress,
  completedCount,
  totalUploaded,
}: DocumentChecklistOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Tiến độ hoàn thành hồ sơ
        </CardTitle>
        <CardDescription>
          Đã hoàn thành {completedRequired}/{requiredCount} giấy tờ bắt buộc
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Giấy tờ bắt buộc</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">{totalUploaded - completedCount}</div>
              <div className="text-sm text-gray-600">Còn lại</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">{requiredCount - completedRequired}</div>
              <div className="text-sm text-gray-600">Bắt buộc còn lại</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{requiredCount}</div>
              <div className="text-sm text-gray-600">Tổng bắt buộc</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

