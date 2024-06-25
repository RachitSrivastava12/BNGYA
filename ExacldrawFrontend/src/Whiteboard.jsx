import React, { useEffect, useRef, useState } from 'react';

const Whiteboard = ({ selectedTool, penColor, textSettings, onSave, brushSize, handleBrushSizeChange }) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastX = useRef(0);
    const lastY = useRef(0);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [prevState, setPrevState] = useState([]);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const handleMouseDown = (e) => {
            isDrawing.current = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setStartX(x);
            setStartY(y);
            lastX.current = x;
            lastY.current = y;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setUndoStack((prev) => [...prev, imageData]);
            setRedoStack([]);

            if (selectedTool === 'text') {
                const text = prompt("Enter the text:");
                if (text) {
                    ctx.font = `${textSettings.fontWeight} ${textSettings.fontStyle} ${textSettings.fontSize}px ${textSettings.fontFamily}`;
                    ctx.fillStyle = penColor;
                    if (textSettings.textDecoration === 'underline') {
                        const textWidth = ctx.measureText(text).width;
                        ctx.fillText(text, x, y);
                        ctx.beginPath();
                        ctx.moveTo(x, y + 2);
                        ctx.lineTo(x + textWidth, y + 2);
                        ctx.strokeStyle = penColor;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    } else {
                        ctx.fillText(text, x, y);
                    }
                }
            }
        };

        const handleMouseMove = (e) => {
            if (!isDrawing.current || selectedTool === 'text') return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.beginPath();
            ctx.strokeStyle = penColor;

            if (selectedTool === 'pen') {
                ctx.lineWidth = brushSize;
                ctx.lineCap = 'round';
                ctx.moveTo(lastX.current, lastY.current);
                ctx.lineTo(x, y);
                ctx.stroke();
                lastX.current = x;
                lastY.current = y;
            } else if (selectedTool === 'eraser') {
                ctx.lineWidth = brushSize * 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'white';
                ctx.moveTo(lastX.current, lastY.current);
                ctx.lineTo(x, y);
                ctx.stroke();
                lastX.current = x;
                lastY.current = y;
            } else if (selectedTool === 'rectangle' || selectedTool === 'circle' || selectedTool === 'arrow') {
                ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
                ctx.lineWidth = 2;
                if (selectedTool === 'rectangle') {
                    ctx.strokeRect(startX, startY, x - startX, y - startY);
                } else if (selectedTool === 'circle') {
                    const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
                    ctx.arc(startX, startY, radius, 0, Math.PI * 2, false);
                    ctx.stroke();
                } else if (selectedTool === 'arrow') {
                    const headlen = 10;
                    const angle = Math.atan2(y - startY, x - startX);
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(x, y);
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - headlen * Math.cos(angle - Math.PI / 6), y - headlen * Math.sin(angle - Math.PI / 6));
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - headlen * Math.cos(angle + Math.PI / 6), y - headlen * Math.sin(angle + Math.PI / 6));
                    ctx.stroke();
                }
            }
        };

        const handleMouseUp = () => {
            isDrawing.current = false;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setPrevState((prev) => [...prev, imageData]);
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [selectedTool, penColor, textSettings, brushSize, undoStack]);

    useEffect(() => {
        if (selectedTool === 'eraseAll') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setPrevState([]);
            setUndoStack([]);
            setRedoStack([]);
        }
    }, [selectedTool]);

    const handleSave = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
    };

    const handleUndo = () => {
        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            setRedoStack((prev) => [...prev, lastState]);
            const canvasSnapshot = undoStack[undoStack.length - 1] || lastState;
            setPrevState((prev) => [...prev, canvasSnapshot]);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(canvasSnapshot, 0, 0);
        }
    };

    const handleRedo = () => {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            setUndoStack((prev) => [...prev, nextState]);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(nextState, 0, 0);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ background: 'white', border: '1px solid black', display: 'block' }}
            ></canvas>
            <div className="controls" style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                <button onClick={handleUndo}>Undo</button>
                <button onClick={handleRedo}>Redo</button>
                <button onClick={handleSave}>Save Drawing</button>
                <label>
                    Brush Size:
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
                    />
                </label>
            </div>
        </div>
    );
};

export default Whiteboard;
