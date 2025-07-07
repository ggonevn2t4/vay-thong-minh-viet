import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  Settings,
  Users,
  MessageSquare,
  Clock,
  Signal,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'advisor' | 'bank_employee';
  isOnline: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

const VideoCallInterface = () => {
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [participants, setParticipants] = useState<CallParticipant[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      role: 'advisor',
      isOnline: true,
      audioEnabled: true,
      videoEnabled: true
    },
    {
      id: '2',
      name: 'Trần Thị B',
      role: 'customer',
      isOnline: true,
      audioEnabled: true,
      videoEnabled: false
    }
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Simulate call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsCallActive(true);
      toast.success('Cuộc gọi đã được kết nối');
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Không thể truy cập camera/microphone');
    }
  };

  const endCall = () => {
    // Stop all media streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsCallActive(false);
    setCallDuration(0);
    toast.info('Cuộc gọi đã kết thúc');
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setIsScreenSharing(true);
        toast.success('Đã bắt đầu chia sẻ màn hình');
      } else {
        setIsScreenSharing(false);
        toast.info('Đã dừng chia sẻ màn hình');
      }
    } catch (error) {
      console.error('Error with screen sharing:', error);
      toast.error('Không thể chia sẻ màn hình');
    }
  };

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Call Status Header */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-green-600" />
              Cuộc gọi Video
            </CardTitle>
            <div className="flex items-center gap-4">
              {isCallActive && (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-mono text-sm">{formatDuration(callDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Signal className={`h-4 w-4 ${getConnectionColor(connectionQuality)}`} />
                    <span className="text-sm capitalize">{connectionQuality}</span>
                  </div>
                </>
              )}
              <Badge variant={isCallActive ? "default" : "outline"}>
                {isCallActive ? 'Đang gọi' : 'Sẵn sàng'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isCallActive ? (
        /* Pre-call Setup */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Preview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Camera Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <VideoOff className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                  <Button
                    size="sm"
                    variant={isVideoEnabled ? "default" : "destructive"}
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={isAudioEnabled ? "default" : "destructive"}
                    onClick={toggleAudio}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Người tham gia ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>
                            {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                          participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {participant.role === 'advisor' ? 'Tư vấn viên' : 
                           participant.role === 'customer' ? 'Khách hàng' : 'Nhân viên ngân hàng'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {participant.audioEnabled ? (
                        <Mic className="h-4 w-4 text-green-600" />
                      ) : (
                        <MicOff className="h-4 w-4 text-red-600" />
                      )}
                      {participant.videoEnabled ? (
                        <Video className="h-4 w-4 text-green-600" />
                      ) : (
                        <VideoOff className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={startCall} className="w-full mt-6 bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" />
                Bắt đầu cuộc gọi
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Active Call Interface */
        <div className="space-y-6">
          {/* Main Video Area */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                {/* Remote Video */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Screen Sharing Indicator */}
                {isScreenSharing && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                    <Monitor className="h-4 w-4 inline mr-1" />
                    Đang chia sẻ màn hình
                  </div>
                )}

                {/* Call Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-3">
                    <Button
                      size="sm"
                      variant={isAudioEnabled ? "default" : "destructive"}
                      onClick={toggleAudio}
                      className="rounded-full h-12 w-12"
                    >
                      {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={isVideoEnabled ? "default" : "destructive"}
                      onClick={toggleVideo}
                      className="rounded-full h-12 w-12"
                    >
                      {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={isScreenSharing ? "default" : "outline"}
                      onClick={toggleScreenShare}
                      className="rounded-full h-12 w-12"
                    >
                      <Monitor className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-12 w-12"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-12 w-12"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={endCall}
                      className="rounded-full h-12 w-12"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Alert className="border-green-200 bg-green-50">
          <Video className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>HD Video:</strong> Chất lượng video cao độ với độ trễ thấp
          </AlertDescription>
        </Alert>
        
        <Alert className="border-blue-200 bg-blue-50">
          <Monitor className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Chia sẻ màn hình:</strong> Trình bày tài liệu và hồ sơ trực tiếp
          </AlertDescription>
        </Alert>
        
        <Alert className="border-purple-200 bg-purple-50">
          <Users className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-700">
            <strong>Đa người tham gia:</strong> Tối đa 10 người trong một cuộc gọi
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default VideoCallInterface;