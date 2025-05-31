
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, TrendingUp, Target, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreditImprovement {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
}

const CreditProfileOptimizer = () => {
  const { toast } = useToast();
  const [currentScore, setCurrentScore] = useState(650);
  const [targetScore, setTargetScore] = useState(750);

  const improvements: CreditImprovement[] = [
    {
      id: '1',
      title: 'Thanh toán đầy đủ các khoản nợ hiện tại',
      description: 'Đảm bảo thanh toán đúng hạn tất cả các khoản vay và thẻ tín dụng',
      impact: 'high',
      timeframe: '1-3 tháng',
      difficulty: 'medium',
      completed: false
    },
    {
      id: '2',
      title: 'Giảm tỷ lệ sử dụng thẻ tín dụng xuống dưới 30%',
      description: 'Duy trì mức sử dụng thẻ tín dụng thấp để cải thiện điểm tín dụng',
      impact: 'high',
      timeframe: '1-2 tháng',
      difficulty: 'easy',
      completed: false
    },
    {
      id: '3',
      title: 'Đa dạng hóa các loại tín dụng',
      description: 'Có sự kết hợp giữa thẻ tín dụng, vay cá nhân và vay thế chấp',
      impact: 'medium',
      timeframe: '3-6 tháng',
      difficulty: 'medium',
      completed: false
    },
    {
      id: '4',
      title: 'Kiểm tra và cải thiện báo cáo tín dụng',
      description: 'Rà soát báo cáo tín dụng và khiếu nại các thông tin sai lệch',
      impact: 'medium',
      timeframe: '2-4 tháng',
      difficulty: 'easy',
      completed: false
    },
    {
      id: '5',
      title: 'Tăng lịch sử tín dụng dài hạn',
      description: 'Duy trì các tài khoản tín dụng cũ và có lịch sử tốt',
      impact: 'low',
      timeframe: '6-12 tháng',
      difficulty: 'easy',
      completed: false
    }
  ];

  const [improvementList, setImprovementList] = useState(improvements);

  const toggleImprovement = (id: string) => {
    setImprovementList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    
    toast({
      title: "Cập nhật tiến độ",
      description: "Tiến độ cải thiện hồ sơ tín dụng đã được cập nhật",
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = improvementList.filter(item => item.completed).length;
  const progressPercentage = (completedCount / improvementList.length) * 100;
  const estimatedScoreIncrease = completedCount * 15;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Tối ưu hóa hồ sơ tín dụng
          </CardTitle>
          <CardDescription>
            Cải thiện điểm tín dụng của bạn để có cơ hội được duyệt vay với lãi suất tốt hơn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentScore}</div>
              <div className="text-sm text-gray-600">Điểm hiện tại</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentScore + estimatedScoreIncrease}</div>
              <div className="text-sm text-gray-600">Điểm dự kiến</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{targetScore}</div>
              <div className="text-sm text-gray-600">Mục tiêu</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Tiến độ cải thiện</span>
              <span className="text-sm text-gray-600">{completedCount}/{improvementList.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="space-y-4">
            {improvementList.map((improvement) => (
              <div key={improvement.id} className={`p-4 border rounded-lg ${improvement.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleImprovement(improvement.id)}
                        className="p-0 h-auto mr-3"
                      >
                        {improvement.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                      </Button>
                      <h4 className={`font-medium ${improvement.completed ? 'line-through text-gray-500' : ''}`}>
                        {improvement.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-8 mb-3">{improvement.description}</p>
                    <div className="flex gap-2 ml-8">
                      <Badge className={getImpactColor(improvement.impact)}>
                        Tác động: {improvement.impact === 'high' ? 'Cao' : improvement.impact === 'medium' ? 'Trung bình' : 'Thấp'}
                      </Badge>
                      <Badge className={getDifficultyColor(improvement.difficulty)}>
                        Độ khó: {improvement.difficulty === 'easy' ? 'Dễ' : improvement.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        {improvement.timeframe}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditProfileOptimizer;
