type ToolbarProps = {
    color: string;
    setColor: (value: string) => void;
    brushSize: number;
    setBrushSize: (value: number) => void;
    tool: 'pen' | 'eraser';
    setTool: (value: 'pen' | 'eraser') => void;
};

const colors = [
    '#ffffff',
    '#000000',
    '#ff3b30',
    '#007aff',
    '#34c759',
    '#ffcc00',
    '#ff66cc',
];

export default function Toolbar({
                                    color,
                                    setColor,
                                    brushSize,
                                    setBrushSize,
                                    tool,
                                    setTool,
                                }: ToolbarProps) {
    return (
        <div className="toolbar">
            <div className="tool-buttons">
                <button
                    type="button"
                    className={tool === 'pen' ? 'active' : ''}
                    onClick={() => setTool('pen')}
                >
                    Caneta
                </button>

                <button
                    type="button"
                    className={tool === 'eraser' ? 'active' : ''}
                    onClick={() => setTool('eraser')}
                >
                    Borracha
                </button>
            </div>

            <div className="color-picker">
                {colors.map((swatch) => (
                    <button
                        key={swatch}
                        type="button"
                        className={color === swatch ? 'color active' : 'color'}
                        style={{ background: swatch }}
                        onClick={() => setColor(swatch)}
                        aria-label={`Escolher cor ${swatch}`}
                    />
                ))}
            </div>

            <div className="brush-control">
                <label htmlFor="brush-size">Espessura</label>
                <input
                    id="brush-size"
                    type="range"
                    min={2}
                    max={20}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                />
            </div>
        </div>
    );
}