import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFreehandCanvas } from '../hooks/useFreehandCanvas';

export interface DrawNameCanvasHandle {
  clear: () => void;
}

export const DrawNameCanvas = forwardRef<DrawNameCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDrawing, startDrawing, draw, stopDrawing, clearCanvas } = useFreehandCanvas(canvasRef);

  useImperativeHandle(ref, () => ({
    clear: clearCanvas,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-40 border-2 border-romantic-primary/30 rounded-lg bg-white dark:bg-black cursor-crosshair touch-none"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{ touchAction: 'none' }}
    />
  );
});

DrawNameCanvas.displayName = 'DrawNameCanvas';
