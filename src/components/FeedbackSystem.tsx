
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  MessageSquare
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FeedbackRating {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const FeedbackSystem = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<string>('experience');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const feedbackTypes = [
    { id: 'experience', label: 'Trải nghiệm sử dụng' },
    { id: 'suggestion', label: 'Đề xuất cải tiến' },
    { id: 'error', label: 'Báo lỗi' },
    { id: 'feature', label: 'Yêu cầu tính năng mới' },
  ];

  const ratingOptions: FeedbackRating[] = [
    { id: '5', name: 'Xuất sắc', icon: <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> },
    { id: '4', name: 'Tốt', icon: <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> },
    { id: '3', name: 'Bình thường', icon: <Star className="h-5 w-5" /> },
    { id: '2', name: 'Cần cải thiện', icon: <ThumbsDown className="h-5 w-5" /> },
    { id: '1', name: 'Không hài lòng', icon: <ThumbsDown className="h-5 w-5 fill-red-500 text-red-500" /> },
  ];

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng chọn đánh giá mức độ hài lòng",
      });
      return;
    }

    // Simulate API call to save feedback
    setTimeout(() => {
      toast({
        title: "Phản hồi đã được gửi",
        description: "Cảm ơn bạn đã góp ý để chúng tôi cải thiện dịch vụ.",
      });
      setSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setRating(0);
    setFeedbackType('experience');
    setFeedbackText('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cảm ơn bạn đã gửi phản hồi!</CardTitle>
          <CardDescription>
            Chúng tôi đánh giá cao ý kiến của bạn và sẽ sử dụng nó để cải thiện dịch vụ của mình.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <ThumbsUp className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-center mb-4">
            Mỗi phản hồi giúp chúng tôi hiểu rõ hơn nhu cầu của bạn và nâng cao chất lượng dịch vụ.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleReset} className="w-full">
            Gửi phản hồi khác
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gửi phản hồi của bạn</CardTitle>
        <CardDescription>
          Hãy chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base">Mức độ hài lòng</Label>
          <div className="flex justify-between items-center mt-2 mb-1">
            {[5, 4, 3, 2, 1].map((value) => (
              <Button
                key={value}
                type="button"
                variant={rating === value ? "default" : "outline"}
                className={`h-12 w-12 rounded-full ${rating === value ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setRating(value)}
              >
                {value >= 4 ? (
                  <Star className={`h-5 w-5 ${rating === value ? 'fill-primary-foreground' : rating >= value ? 'fill-yellow-400' : ''}`} />
                ) : value <= 2 ? (
                  <ThumbsDown className={`h-5 w-5 ${rating === value ? 'fill-primary-foreground' : ''}`} />
                ) : (
                  <MessageSquare className={`h-5 w-5 ${rating === value ? 'fill-primary-foreground' : ''}`} />
                )}
              </Button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground px-1 mt-1">
            <span>Xuất sắc</span>
            <span>Không hài lòng</span>
          </div>
        </div>

        <div>
          <Label className="text-base" htmlFor="feedback-type">Loại phản hồi</Label>
          <RadioGroup
            id="feedback-type"
            value={feedbackType}
            onValueChange={setFeedbackType}
            className="grid grid-cols-2 gap-2 mt-2"
          >
            {feedbackTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id} className="font-normal cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base" htmlFor="feedback-detail">Chi tiết phản hồi</Label>
          <Textarea
            id="feedback-detail"
            placeholder="Hãy chia sẻ chi tiết phản hồi của bạn..."
            className="mt-2 h-32"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>Đặt lại</Button>
        <Button onClick={handleSubmitFeedback}>Gửi phản hồi</Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackSystem;
