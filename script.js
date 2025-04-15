let arr = [];
const container = document.getElementById('array-container');
const statusText = document.getElementById('status');

function displayArray(current, highlight = []) {
  container.innerHTML = '';
  current.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.textContent = val;
    if (highlight[i]) {
      bar.classList.add(highlight[i]);
    }
    container.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mergeSort(start, end) {
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);

  // Divide Step
  statusText.innerText = `Dividing: [${arr.slice(start, mid + 1)}] and [${arr.slice(mid + 1, end + 1)}]`;
  let highlight = arr.map((_, i) => (i >= start && i <= end ? 'divide' : ''));
  displayArray([...arr], highlight);
  await sleep(800);

  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let left = arr.slice(start, mid + 1);
  let right = arr.slice(mid + 1, end + 1);

  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
    displayArray([...arr], arr.map((_, idx) => idx >= start && idx <= end ? 'merge' : ''));
    statusText.innerText = `Merging: [${left}] and [${right}] → [${arr.slice(start, k)}]`;
    await sleep(500);
  }

  while (i < left.length) {
    arr[k++] = left[i++];
    displayArray([...arr], arr.map((_, idx) => idx >= start && idx <= end ? 'merge' : ''));
    await sleep(300);
  }

  while (j < right.length) {
    arr[k++] = right[j++];
    displayArray([...arr], arr.map((_, idx) => idx >= start && idx <= end ? 'merge' : ''));
    await sleep(300);
  }

  statusText.innerText = `Merged: [${arr.slice(start, end + 1)}]`;
  await sleep(500);
}

async function handleUserInput() {
  const input = document.getElementById('user-input').value;
  if (!input.trim()) return;

  arr = input.split(',').map(Number).filter(num => !isNaN(num));
  if (arr.length === 0) {
    alert("Please enter a valid comma-separated number list.");
    return;
  }

  statusText.innerText = "Starting Merge Sort...";
  displayArray([...arr]);
  await sleep(1000);

  await mergeSort(0, arr.length - 1);

  statusText.innerText = `Sorted Array: [${arr.join(', ')}]`;
  displayArray([...arr]);
}
