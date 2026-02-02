import { animateSwap } from '../logic/bubbleSort.js'
import '../styles/comparing.css'

async function highlightBox(index, boxes, speed = 1) {
    const box = boxes[index];
    box.classList.add('highlighted');
    await new Promise(resolve => setTimeout(resolve, 400 * speed));
}

async function removeHighlight(index, boxes, speed = 1) {
    const box = boxes[index];
    box.classList.remove('highlighted');
    await new Promise(resolve => setTimeout(resolve, 300 * speed));
}

async function showComparing(rightIndex, boxes, speed = 1) {
    const right = boxes[rightIndex];
    right.classList.add('comparing');
    await new Promise(resolve => setTimeout(resolve, 500 * speed));
    right.classList.remove('comparing');
    await new Promise(resolve => setTimeout(resolve, 200 * speed));
}

export default async function selectionSort(array, length, container, speed = 1) {
    const boxes = container.querySelectorAll('.array-box');

    for (let i = 0; i < length; i++) {
        let minimumIndex = i;
        await highlightBox(minimumIndex, boxes, speed);

        for (let j = i + 1; j < length; j++) {
            await showComparing(j, boxes, speed);
            if (array[j] < array[minimumIndex]) {
                await removeHighlight(minimumIndex, boxes, speed);
                minimumIndex = j;
                await highlightBox(minimumIndex, boxes, speed);
            }
        }
        await removeHighlight(minimumIndex, boxes, speed);
        if (minimumIndex !== i) {
            await animateSwap(i, minimumIndex, boxes, speed);
            let temp = array[i];
            array[i] = array[minimumIndex];
            array[minimumIndex] = temp;
        }
        boxes[i].classList.add('sorted');
        await new Promise(resolve => setTimeout(resolve, 300 * speed));
    }
    boxes[length - 1].classList.add('sorted');
    return array;
}