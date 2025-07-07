import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

const SmartReplySystem = () => {
  const [selectedReply, setSelectedReply] = useState<string | null>(null);

  const suggestions = [
    "Cảm ơn bạn đã quan tâm. Tôi sẽ kiểm tra và phản hồi trong vòng 24h.",
    "Để hỗ trợ tốt nhất, bạn có thể cung cấp thêm thông tin về thu nhập không?",
    "Gói vay này phù hợp với hồ sơ của bạn. Chúng ta có thể bàn thêm chi tiết.",
    "Tài liệu bạn gửi đã đầy đủ. Tôi sẽ chuyển cho bộ phận thẩm định."
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-pink-600" />
            Trả lời thông minh với AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium mb-1">Tin nhắn từ khách hàng:</p>
                <p className="text-gray-700">"Tôi muốn vay 500 triệu để mua nhà, thu nhập 20 triệu/tháng. Có gói nào phù hợp không?"</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              Gợi ý trả lời từ AI:
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedReply === suggestion ? 'border-pink-500 bg-pink-50' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedReply(suggestion)}
                >
                  <p className="text-sm">{suggestion}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      AI Confidence: {95 - index * 5}%
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            disabled={!selectedReply}
            className="w-full"
          >
            Sử dụng câu trả lời này
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartReplySystem;