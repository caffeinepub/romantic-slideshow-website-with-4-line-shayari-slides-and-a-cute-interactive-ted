import { useState, useCallback, RefObject } from 'react';

interface Point {
  x: number;
  y: number;
}

export function useFreehandCanvas(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const getCoordinates = useCallback(
    (e: MouseEvent | TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if ('touches' in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    [canvasRef]
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
      const point = getCoordinates(nativeEvent);
      if (point) {
        setIsDrawing(true);
        setLastPoint(point);
      }
    },
    [getCoordinates]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
      const point = getCoordinates(nativeEvent);
      if (!point || !lastPoint) return;

      // Draw line
      ctx.strokeStyle = '#e91e63'; // romantic-primary color
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      setLastPoint(point);
    },
    [isDrawing, lastPoint, canvasRef, getCoordinates]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  return {
    isDrawing,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  };
}
