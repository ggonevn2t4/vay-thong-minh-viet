
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Move, RotateCcw } from 'lucide-react';

interface ImageViewerProps {
  fileUrl: string;
  fileName: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ fileUrl, fileName }) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetView = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 5.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.25));
  };

  const rotateClockwise = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation(prevRotation => (prevRotation - 90 + 360) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Reset position when scale changes
  useEffect(() => {
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải ảnh</p>
          <p className="text-sm text-gray-500">Vui lòng thử tải xuống file để xem</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.25}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 5.0}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={rotateCounterClockwise}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={rotateClockwise}>
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={resetView}>
            <Move className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Image Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden bg-gray-100 relative flex items-center justify-center"
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        )}
        
        <img
          ref={imageRef}
          src={fileUrl}
          alt={fileName}
          className="max-w-none transition-transform duration-200"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />
      </div>

      {/* Instructions */}
      {scale > 1 && (
        <div className="p-2 text-xs text-gray-500 text-center border-t bg-gray-50">
          Kéo để di chuyển ảnh • Cuộn chuột để zoom
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
