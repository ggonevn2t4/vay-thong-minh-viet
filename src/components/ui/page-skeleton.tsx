
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PageSkeletonProps {
  type?: 'dashboard' | 'list' | 'detail' | 'marketplace';
  className?: string;
}

const PageSkeleton = ({ type = 'dashboard', className }: PageSkeletonProps) => {
  if (type === 'marketplace') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Search and filters skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </CardContent>
        </Card>
        
        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 rounded-xl">
                  <Skeleton className="h-8 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                </div>
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Default dashboard skeleton
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
