import React, { useState } from 'react';
import './DrawingTools.css';

const DrawingTools = ({ selectedTool, onSelectTool, onColorChange, onEraseAll, onTextSettingsChange, onBrushSizeChange }) => {
    const [fontSize, setFontSize] = useState(16);
    const [fontWeight, setFontWeight] = useState('normal');
    const [fontStyle, setFontStyle] = useState('normal');
    const [textDecoration, setTextDecoration] = useState('none');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [brushSize, setBrushSize] = useState(5);

    const handlePenColorChange = (color) => {
        onColorChange(color);
        onSelectTool('pen');
    };

    const handleTextSettingsChange = () => {
        onTextSettingsChange({ fontSize, fontWeight, fontStyle, textDecoration, fontFamily });
    };

    const handleBrushSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setBrushSize(size);
        onBrushSizeChange(size);
    };

    return (
        <div className="drawing-tools">
            <button className={`tool ${selectedTool === 'pen' ? 'active' : ''}`} onClick={() => onSelectTool('pen')}>
                Pen
            </button>
            <button className={`tool ${selectedTool === 'eraser' ? 'active' : ''}`} onClick={() => onSelectTool('eraser')}>
                Eraser
            </button>
            <button className={`tool ${selectedTool === 'rectangle' ? 'active' : ''}`} onClick={() => onSelectTool('rectangle')}>
                Rectangle
            </button>
            <button className={`tool ${selectedTool === 'circle' ? 'active' : ''}`} onClick={() => onSelectTool('circle')}>
                Circle
            </button>
            <button className={`tool ${selectedTool === 'arrow' ? 'active' : ''}`} onClick={() => onSelectTool('arrow')}>
                Arrow
            </button>
            <button className={`tool ${selectedTool === 'text' ? 'active' : ''}`} onClick={() => onSelectTool('text')}>
                Text
            </button>
            <button className="tool" onClick={onEraseAll}>
                Erase All
            </button>
            <div className="color-picker">
                <input type="color" onChange={(e) => handlePenColorChange(e.target.value)} />
            </div>
            <div className="text-settings">
                <label>
                    Font Size:
                    <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        onBlur={handleTextSettingsChange}
                    />
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={fontWeight === 'bold'}
                        onChange={(e) => {
                            setFontWeight(e.target.checked ? 'bold' : 'normal');
                            handleTextSettingsChange();
                        }}
                    />
                    Bold
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={fontStyle === 'italic'}
                        onChange={(e) => {
                            setFontStyle(e.target.checked ? 'italic' : 'normal');
                            handleTextSettingsChange();
                        }}
                    />
                    Italic
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={textDecoration === 'underline'}
                        onChange={(e) => {
                            setTextDecoration(e.target.checked ? 'underline' : 'none');
                            handleTextSettingsChange();
                        }}
                    />
                    Underline
                </label>
                <label>
                    Font Family:
                    <select
                        value={fontFamily}
                        onChange={(e) => {
                            setFontFamily(e.target.value);
                            handleTextSettingsChange();
                        }}
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                    </select>
                </label>
            </div>
            <div className="brush-size">
                <label>
                    Brush Size:
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={handleBrushSizeChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default DrawingTools;