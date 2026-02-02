import '../styles/comparing.css'

export async function animateSwap(smallerIndex, largerIndex, boxes, speed = 1) {
    const smallerElement = boxes[smallerIndex];
    const largerElement = boxes[largerIndex];

    const smallerPosition = smallerElement.getBoundingClientRect();
    const largerPosition = largerElement.getBoundingClientRect();

    const smallerMove = largerPosition.left - smallerPosition.left;
    const largerMove = smallerPosition.left - largerPosition.left;

    smallerElement.classList.add('comparing');
    largerElement.classList.add('comparing');
    await new Promise(resolve => setTimeout(resolve, 500 * speed));

    return new Promise(resolve => {
        smallerElement.style.transform = `translateX(${smallerMove}px)`;
        largerElement.style.transform = `translateX(${largerMove}px)`;

        smallerElement.style.transition = `transform ${0.5 * speed}s ease`;
        largerElement.style.transition = `transform ${0.5 * speed}s ease`;
        smallerElement.style.zIndex = '10';
        largerElement.style.zIndex = '10';

        setTimeout(() => {
            const smallerText = smallerElement.querySelector('p').textContent;
            const largerText = largerElement.querySelector('p').textContent;
            smallerElement.querySelector('p').textContent = largerText;
            largerElement.querySelector('p').textContent = smallerText;

            smallerElement.style.transform = '';
            largerElement.style.transform = '';
            smallerElement.style.transition = '';
            largerElement.style.transition = '';
            smallerElement.style.zIndex = '';
            largerElement.style.zIndex = '';

            smallerElement.classList.remove('comparing');
            largerElement.classList.remove('comparing');

            resolve();
        }, 500 * speed);
    });
}

async function showComparing(leftIndex, rightIndex, boxes, speed = 1) {
    const left = boxes[leftIndex];
    const right = boxes[rightIndex];

    left.classList.add('comparing');
    right.classList.add('comparing');
    await new Promise(resolve => setTimeout(resolve, 500 * speed));

    left.classList.remove('comparing');
    right.classList.remove('comparing');
}

export default async function bubbleSort(array, length, container, speed = 1) {
    let temp;
    let lastElement = length - 1;
    const boxes = container.querySelectorAll('.array-box');

    for (let i = 0; i < length - 1; i++) {
        let swapped = false;
        for (let j = 0; j < length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await animateSwap(j + 1, j, boxes, speed);

                temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                swapped = true;
            }
            else {
                await showComparing(j, j + 1, boxes, speed);
            }
        }
        boxes[lastElement].classList.add('sorted');
        lastElement--;
        if (swapped === false) break;
    }
    boxes[lastElement].classList.add('sorted');
    return array;
}