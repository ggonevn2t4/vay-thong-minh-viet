
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "destructive" | "success" | "warning";
  className?: string;
  animate?: boolean;
}

const NotificationBadge = ({ 
  count, 
  maxCount = 99, 
  size = "md", 
  variant = "destructive",
  className,
  animate = true
}: NotificationBadgeProps) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  const sizeClasses = {
    sm: "h-4 min-w-4 text-xs px-1",
    md: "h-5 min-w-5 text-xs px-1.5",
    lg: "h-6 min-w-6 text-sm px-2"
  };

  const variantClasses = {
    default: "bg-gray-500 hover:bg-gray-600",
    destructive: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
    warning: "bg-yellow-500 hover:bg-yellow-600"
  };

  return (
    <Badge 
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white border-0",
        sizeClasses[size],
        variantClasses[variant],
        animate && count > 0 && "animate-pulse",
        className
      )}
    >
      {displayCount}
    </Badge>
  );
};

export default NotificationBadge;
