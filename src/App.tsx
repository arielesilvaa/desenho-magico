import { useEffect, useRef } from 'react';

type DrawingCanvasProps = {
    color: string;
    brushSize: number;
    tool: 'pen' | 'eraser';
    hand: {
        x: number;
        y: number;
        visible: boolean;
        handCount: number;
    };
};

export default function DrawingCanvas({
                                          color,
                                          brushSize,
                                          tool,
                                          hand,
                                      }: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * ratio;
            canvas.height = window.innerHeight * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        resize();
        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        if (!hand.visible) {
            isDrawingRef.current = false;
            lastPointRef.current = null;
            return;
        }

        const x = (hand.x / window.innerWidth) * canvas.width;
        const y = (hand.y / window.innerHeight) * canvas.height;

        if (!isDrawingRef.current) {
            isDrawingRef.current = true;
            ctx.beginPath();
            ctx.moveTo(x / window.devicePixelRatio, y / window.devicePixelRatio);
            ctx.lineWidth = brushSize;
            ctx.strokeStyle = tool === 'eraser' ? '#000000' : color;
            ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
            lastPointRef.current = { x: x / window.devicePixelRatio, y: y / window.devicePixelRatio };
            return;
        }

        const prev = lastPointRef.current;
        if (prev) {
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(x / window.devicePixelRatio, y / window.devicePixelRatio);
            ctx.stroke();
        }

        lastPointRef.current = {
            x: x / window.devicePixelRatio,
            y: y / window.devicePixelRatio,
        };
    }, [hand, color, brushSize, tool]);

    return (
        <canvas
            ref={canvasRef}
            className="drawing-canvas"
        />
    );
}