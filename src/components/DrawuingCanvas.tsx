import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

type DrawingCanvasProps = {
    color: string;
    brushSize: number;
    tool: 'pen' | 'eraser';
};

export default function DrawingCanvas({
                                          color,
                                          brushSize,
                                          tool,
                                      }: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * ratio;
            canvas.height = window.innerHeight * ratio;

            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const point = getPoint(event);
        if (!point) return;

        drawingRef.current = true;

        ctx.beginPath();
        ctx.moveTo(point.x, point.y);

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
        }
    };

    const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !drawingRef.current) return;

        const point = getPoint(event);
        if (!point) return;

        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        drawingRef.current = false;

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.globalCompositeOperation = 'source-over';
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
        />
    );
}