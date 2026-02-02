import React, { useState, useEffect, useRef } from "react";
import ArrayContainer from "../components/ArrayContainer.jsx";
import mergeSort from "../logic/mergeSort.js";
import { useOutletContext } from "react-router-dom";
import Settings from "../components/Settings.jsx";

function MergeSort() {
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
        animationRef.current.innerHTML = "";
        setResetArray([...array]);
        const test = await mergeSort(array, 0, array.length - 1, animationRef.current, 0, 'center', null, speed);
        const returnedArray = Array.from(test.querySelectorAll('.array-box p')).map(el => parseInt(el.textContent));
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
        {!sorted && !runSort && <ArrayContainer array={array} />}
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
              setArray([...resetArray]);
              setSortedArray([]);
              setSorted(false);
              setRunSort(false);
              animationRef.current.innerHTML = "";
            }
          }}
          >Reset</button>
        </div>
      </div>
    </div>

  );
}

export default MergeSort;