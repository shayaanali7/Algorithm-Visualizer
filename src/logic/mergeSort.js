import '../styles/arrayBox.css';

export function createSubArray(array, left, right, level = 0, position = 'center', parentPosition = null) {
    const container = document.createElement('div');
    container.className = 'array-container';
    container.style.position = 'absolute';

    const levelHeight = 60 + (level * 60);
    let horizontalOffset = 0;

    if (parentPosition && (position === 'left' || position === 'right')) {
        const baseOffset = Math.max(60, 120 - (level * 15));
        const offsetFromParent = position === 'left' ? -baseOffset : baseOffset;
        horizontalOffset = parentPosition.horizontalOffset + offsetFromParent;
    } else {
        horizontalOffset = 0;
    }

    if (parentPosition && (position === 'left' || position === 'right')) {
        container.style.top = `${parentPosition.top}px`;
        container.style.left = `50%`;
        container.style.transform = `translateX(calc(-50% + ${parentPosition.horizontalOffset}px))`;
    } else {
        container.style.top = `${levelHeight}px`;
        container.style.left = `50%`;
        container.style.transform = `translateX(calc(-50% + ${horizontalOffset}px))`;
    }
    container.finalTop = levelHeight;
    container.finalHorizontalOffset = horizontalOffset;

    for (let i = left; i <= right; i++) {
        const box = document.createElement('div');
        const value = document.createElement('p');

        box.className = 'array-box';
        value.textContent = array[i];
        box.appendChild(value);
        container.appendChild(box);
    }
    return container;
}

async function animateDivision(division, direction, delay = 0, speed = 1) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const finalTop = division.finalTop;
            const finalHorizontalOffset = division.finalHorizontalOffset;
            const finalTransform = `translateX(calc(-50% + ${finalHorizontalOffset}px))`;

            division.animate([
                {
                    top: division.style.top,
                    transform: division.style.transform
                },
                {
                    top: `${finalTop}px`,
                    transform: finalTransform
                }
            ], {
                duration: 450 * speed,
                easing: 'ease-in-out',
                fill: 'forwards'
            });
            division.style.top = `${finalTop}px`;
            division.style.transform = finalTransform;
            setTimeout(resolve, 450 * speed);
        }, delay * speed);
    });
}

async function cleanupSubarrays(leftDiv, rightDiv, delay = 0, speed = 1) {
    return new Promise((resolve) => {
        setTimeout(() => {
            leftDiv.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 200 * speed,
                fill: 'forwards'
            });

            rightDiv.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 200 * speed,
                fill: 'forwards'
            });

            setTimeout(() => {
                leftDiv.remove();
                rightDiv.remove();
                resolve();
            }, 200 * speed);
        }, delay * speed);
    });
}

async function animateBoxMerge(sourceDiv, targetDiv, sourceIndex, targetIndex, value, delay = 0, speed = 1) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sourceBoxes = sourceDiv.querySelectorAll('.array-box');
            const targetBoxes = targetDiv.querySelectorAll('.array-box');
            const sourceBox = sourceBoxes[sourceIndex];
            const targetBox = targetBoxes[targetIndex];

            if (!sourceBox || !targetBox) {
                resolve();
                return;
            }

            const cloneBox = sourceBox.cloneNode(true);
            cloneBox.style.position = 'absolute';
            cloneBox.style.zIndex = '1000';

            const sourceRect = sourceBox.getBoundingClientRect();
            const targetRect = targetBox.getBoundingClientRect();
            const containerRect = targetDiv.getBoundingClientRect();

            cloneBox.style.left = `${sourceRect.left - containerRect.left}px`;
            cloneBox.style.top = `${sourceRect.top - containerRect.top}px`;
            cloneBox.style.width = `${sourceRect.width}px`;
            cloneBox.style.height = `${sourceRect.height}px`;

            targetDiv.appendChild(cloneBox);
            cloneBox.animate([
                {
                    left: `${sourceRect.left - containerRect.left}px`,
                    top: `${sourceRect.top - containerRect.top}px`,
                    transform: 'scale(1)',
                    opacity: 1
                },
                {
                    left: `${targetRect.left - containerRect.left}px`,
                    top: `${targetRect.top - containerRect.top}px`,
                    transform: 'scale(1.1)',
                    opacity: 0.8
                },
                {
                    left: `${targetRect.left - containerRect.left}px`,
                    top: `${targetRect.top - containerRect.top}px`,
                    transform: 'scale(1)',
                    opacity: 0
                }
            ], {
                duration: 450 * speed,
                easing: 'ease-in-out',
                fill: 'forwards'
            });

            setTimeout(() => {
                targetBox.querySelector('p').textContent = value;
                targetBox.style.background = '#4CAF50';
                targetBox.style.transform = 'scale(1.1)';

                setTimeout(() => {
                    targetBox.style.transform = 'scale(1)';
                    cloneBox.remove();
                    resolve();
                }, 250 * speed);
            }, 350 * speed);

        }, delay * speed);
    });
}

async function merge(array, left, middle, right, leftDiv, rightDiv, parentDiv, speed = 1) {
    const leftArray = array.slice(left, middle + 1);
    const rightArray = array.slice(middle + 1, right + 1);

    let i = 0, j = 0, k = left;
    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            await animateBoxMerge(leftDiv, parentDiv, i, k - left, leftArray[i], 150, speed);
            i++;
        } else {
            array[k] = rightArray[j];
            await animateBoxMerge(rightDiv, parentDiv, j, k - left, rightArray[j], 150, speed);
            j++;
        }
        k++;
    }

    while (i < leftArray.length) {
        array[k] = leftArray[i];
        await animateBoxMerge(leftDiv, parentDiv, i, k - left, leftArray[i], 150, speed);
        i++;
        k++;
    }

    while (j < rightArray.length) {
        array[k] = rightArray[j];
        await animateBoxMerge(rightDiv, parentDiv, j, k - left, rightArray[j], 150, speed);
        j++;
        k++;
    }
}

export default async function mergeSort(array, left, right, container, level = 0, position = 'center', parentElement = null, speed = 1) {
    if (left > right) {
        return null;
    }

    let parentPosition = null;
    if (parentElement && (position === 'left' || position === 'right')) {
        parentPosition = {
            top: parseInt(parentElement.style.top),
            horizontalOffset: parentElement.finalHorizontalOffset || 0
        };
    }

    const curr = createSubArray(array, left, right, level, position, parentPosition);
    container.appendChild(curr);
    if (position === 'left' || position === 'right') {
        await animateDivision(curr, position, 0, speed);
    } else {
        await new Promise((resolve) => setTimeout(resolve, 300 * speed));
    }

    if (left === right) {
        return curr;
    }

    const middle = Math.floor(left + (right - left) / 2);
    await new Promise((resolve) => setTimeout(resolve, 200 * speed));
    const leftSubarray = await mergeSort(array, left, middle, container, level + 1, 'left', curr, speed);
    const rightSubarray = await mergeSort(array, middle + 1, right, container, level + 1, 'right', curr, speed);

    if (leftSubarray && rightSubarray) {
        await merge(array, left, middle, right, leftSubarray, rightSubarray, curr, speed);
        await cleanupSubarrays(leftSubarray, rightSubarray, 300, speed);
    }
    return curr;
}