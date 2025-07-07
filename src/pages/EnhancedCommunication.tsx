import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import VideoCallInterface from '@/components/communication/VideoCallInterface';
import GroupMessagingHub from '@/components/communication/GroupMessagingHub';
import MessageBroadcasting from '@/components/communication/MessageBroadcasting';
import SmartReplySystem from '@/components/communication/SmartReplySystem';
import CommunicationAnalytics from '@/components/communication/CommunicationAnalytics';
import EnhancedMessagingInterface from '@/components/messaging/EnhancedMessagingInterface';
import { 
  Video, 
  Users, 
  Radio, 
  MessageSquare, 
  BarChart3, 
  Zap,
  Phone,
  Globe,
  Brain,
  Headphones
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedCommunication = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messaging');

  const communicationFeatures = [
    {
      id: 'messaging',
      title: 'Tin nhắn nâng cao',
      description: 'Giao tiếp real-time với tính năng AI',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: 'video-calls',
      title: 'Cuộc gọi Video',
      description: 'Video call HD với chia sẻ màn hình',
      icon: Video,
      color: 'green'
    },
    {
      id: 'group-chat',
      title: 'Nhóm chat',
      description: 'Tạo và quản lý nhóm chat đa người',
      icon: Users,
      color: 'purple'
    },
    {
      id: 'broadcasting',
      title: 'Phát sóng tin nhắn',
      description: 'Gửi thông báo đến nhiều người cùng lúc',
      icon: Radio,
      color: 'orange'
    },
    {
      id: 'smart-reply',
      title: 'Trả lời thông minh',
      description: 'AI gợi ý câu trả lời phù hợp',
      icon: Brain,
      color: 'pink'
    },
    {
      id: 'analytics',
      title: 'Phân tích giao tiếp',
      description: 'Báo cáo và thống kê hoạt động',
      icon: BarChart3,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'green': return 'text-green-600 bg-green-100';
      case 'purple': return 'text-purple-600 bg-purple-100';
      case 'orange': return 'text-orange-600 bg-orange-100';
      case 'pink': return 'text-pink-600 bg-pink-100';
      case 'indigo': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Hệ thống giao tiếp nâng cao
              </h1>
              <p className="text-lg text-gray-600">
                Trải nghiệm giao tiếp toàn diện với công nghệ AI và real-time
              </p>
            </div>

            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {communicationFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={feature.id}
                    className={`cursor-pointer transition-all hover:shadow-lg border-0 ${
                      activeTab === feature.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setActiveTab(feature.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getColorClasses(feature.color)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6 mb-8 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="messaging" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Tin nhắn</span>
                </TabsTrigger>
                <TabsTrigger value="video-calls" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Video</span>
                </TabsTrigger>
                <TabsTrigger value="group-chat" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Nhóm</span>
                </TabsTrigger>
                <TabsTrigger value="broadcasting" className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  <span className="hidden sm:inline">Phát sóng</span>
                </TabsTrigger>
                <TabsTrigger value="smart-reply" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">AI</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Phân tích</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="messaging" className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Giao diện tin nhắn nâng cao
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedMessagingInterface />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video-calls" className="space-y-6">
                <VideoCallInterface />
              </TabsContent>

              <TabsContent value="group-chat" className="space-y-6">
                <GroupMessagingHub />
              </TabsContent>

              <TabsContent value="broadcasting" className="space-y-6">
                <MessageBroadcasting />
              </TabsContent>

              <TabsContent value="smart-reply" className="space-y-6">
                <SmartReplySystem />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <CommunicationAnalytics />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions */}
          <div className="max-w-6xl mx-auto mt-12">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Khám phá tính năng mới
                    </h3>
                    <p className="text-blue-100">
                      Trải nghiệm giao tiếp thế hệ mới với AI và real-time technology
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Voice Call</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Translation</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                      <Headphones className="h-4 w-4" />
                      <span className="text-sm">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EnhancedCommunication;