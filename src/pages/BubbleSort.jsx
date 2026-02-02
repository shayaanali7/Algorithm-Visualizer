import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ArrayContainer from "../components/ArrayContainer.jsx";
import Settings from "../components/Settings.jsx";
import bubbleSort from "../logic/bubbleSort.js"

function BubbleSort() {
  const { showSettings, setShowSettings } = useOutletContext();

  const [array, setArray] = useState([3, 6, 9, 4, 1, 2, 5, 7, 8, 0]);
  const [resetArray, setResetArray] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [speed, setSpeed] = useState(1);


  const [runSort, setRunSort] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [showAnimationText, setShowAnimationText] = useState(false);
  const animationRef = useRef();

  useEffect(() => {
    if (runSort && animationRef.current) {
      const run = async () => {
        setResetArray([...array]);
        const returnedArray = await bubbleSort(array, array.length, animationRef.current, speed);
        setSortedArray(returnedArray);
        setRunSort(false);
        setSorted(true);
      };

      if ((resetArray.length === 0 && sortedArray.length === 0) || !equalArrays(resetArray, sortedArray)) {
        run();
      }

    }
  }, [runSort])


  function equalArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const resetSorted = [...arr1].sort((a, b) => a - b);
    for (let i = 0; i < resetSorted.length; i++) {
      if (resetSorted[i] !== arr2[i]) return false;
    }
    return true;
  }

  return (
    <div className="context">
      <Settings className={showSettings ? "active" : ""} closeSettings={() => setShowSettings(false)} onArrayChange={(arr) => setArray(arr)} speed={speed} onSpeedChange={(newSpeed) => setSpeed(newSpeed)}></Settings>
      <div className="animation-section" ref={animationRef}>
        {<ArrayContainer array={array} />}
      </div>

      <div className="command-buttons">
        <p className="animation-in-progress-text"
          style={{ opacity: showAnimationText ? 1 : 0, transition: 'opacity 0.3s' }}>Animation in Progress Please Wait.</p>
        <div className="buttons">
          <button className="start-button" onClick={() => setRunSort(true)}>Start</button>
          <button className="reset-button" onClick={() => {
            if (runSort && !sorted) {
              setShowAnimationText(true);
              setTimeout(() => setShowAnimationText(false), 2000);
              return;
            }
            else if (resetArray.length === 0) {
              return;
            }
            else {
              const boxes = animationRef.current.querySelectorAll('.array-box')
              boxes.forEach(box => box.classList.remove('sorted'));
              setArray([...resetArray]);
              setSortedArray([]);
              setSorted(false);
              setRunSort(false);
            }
          }}
          >Reset</button>
        </div>
      </div>
    </div>

  );
}

export default BubbleSort;