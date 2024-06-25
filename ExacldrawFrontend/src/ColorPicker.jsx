// ColorPicker.jsx
import React from 'react';
import './colorpicker.css';

const colors = ['orange', 'red', 'pink', 'blue', 'yellow', 'green', 'grey', 'lightblue', 'lightgreen', 'lightcoral'];

const ColorPicker = ({ onSelectColor }) => {
    const handleColorSelect = (color) => {
        onSelectColor(color);
    };

    return (
        <div className="color-picker">
            {colors.map((color) => (
                <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                ></div>
            ))}
        </div>
    );
};

export default ColorPicker;
