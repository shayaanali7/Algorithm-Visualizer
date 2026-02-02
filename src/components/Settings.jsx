import React, { useState } from "react";
import { AiOutlineClose } from 'react-icons/ai';
import '../styles/settings.css';

function Settings({ className, closeSettings, onArrayChange, speed, onSpeedChange }) {
  const [inputValue, setInputValue] = useState('');
  const [size, setSize] = useState(2);

  const saveChange = () => {
    setInputValue('');
    const arr = inputValue.split(',')
      .map(num => Number(num.trim()))
      .filter(num => !isNaN(num))
    if (arr.length > 1) onArrayChange(arr);
  };

  const generateArray = (size) => {
    const arr = new Array(size);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 100);
    }
    onArrayChange(arr);
    setSize(2);
  }

  return (
    <div className={`settingsNav ${className}`}>
      <div className='array-input'>
        <h4>Array For Sorting:</h4>
        <input
          type="text"
          placeholder="(Min length = 2) with comma: 1,2,3,4...."
          id="array-content"
          className='array-input-text'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}>
        </input>
        <button className="array-input-button" onClick={saveChange}>Save</button>
      </div>

      <div className="random-array">
        <h4>Random Array Generator</h4>
        <label htmlFor="array-size">Choose an Array Size:</label>
        <select id="array-size" value={size} onChange={e => setSize(Number(e.target.value))}>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
        </select>
        <button className="random-array-button" onClick={() => generateArray(size)}>Random</button>
      </div>

      <div className="speed-control">
        <h4>Animation Speed</h4>
        <label htmlFor="speed-slider">
          Speed: {speed.toFixed(1)}s
        </label>
        <input
          type="range"
          id="speed-slider"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
        />
        <div className="speed-labels">
          <span>Fast (0.5s)</span>
          <span>Slow (2s)</span>
        </div>
      </div>

      <AiOutlineClose className='close-icon' onClick={closeSettings}></AiOutlineClose>
    </div>
  );
}

export default Settings;