
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  userName: string;
  userAvatar?: string;
}

const TypingIndicator = ({ userName, userAvatar }: TypingIndicatorProps) => {
  return (
    <div className="flex gap-3 justify-start animate-fade-in">
      <Avatar className="h-8 w-8">
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback className="bg-brand-600 text-white text-xs">
          {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="bg-white p-3 rounded-lg rounded-bl-sm border shadow-sm">
        <div className="flex gap-1 items-center">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">đang nhập...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
