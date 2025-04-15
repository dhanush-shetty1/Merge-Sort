const array = [38, 27, 43, 3, 9, 82, 10];
const container = document.getElementById('array-container');
const status = document.getElementById('status');

function displayArray(arr, highlight = []) {
  container.innerHTML = '';
  arr.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.textContent = val;
    if (highlight[i]) {
      bar.classList.add(highlight[i]);
    }
    container.appendChild(bar);
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mergeSort(arr, left, right) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  await mergeSort(arr, left, mid);
  await mergeSort(arr, mid + 1, right);
  await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
  let leftPart = arr.slice(left, mid + 1);
  let rightPart = arr.slice(mid + 1, right + 1);

  // Show split
  let tempArray = [...arr];
  for (let i = left; i <= right; i++) tempArray[i] = '';
  displayArray(tempArray.map((v, i) => v === '' ? (leftPart[i - left] || rightPart[i - mid - 1] || '') : v),
               tempArray.map((v, i) => i >= left && i <= right ? 'split' : ''));
  status.innerText = `Dividing: ${leftPart} and ${rightPart}`;
  await sleep(1000);

  let i = 0, j = 0, k = left;

  while (i < leftPart.length && j < rightPart.length) {
    if (leftPart[i] <= rightPart[j]) {
      arr[k++] = leftPart[i++];
    } else {
      arr[k++] = rightPart[j++];
    }
    displayArray([...arr], arr.map((_, idx) => idx >= left && idx <= right ? 'merge' : ''));
    await sleep(300);
  }

  while (i < leftPart.length) {
    arr[k++] = leftPart[i++];
    displayArray([...arr], arr.map((_, idx) => idx >= left && idx <= right ? 'merge' : ''));
    await sleep(300);
  }

  while (j < rightPart.length) {
    arr[k++] = rightPart[j++];
    displayArray([...arr], arr.map((_, idx) => idx >= left && idx <= right ? 'merge' : ''));
    await sleep(300);
  }

  status.innerText = `Merged: ${arr.slice(left, right + 1)}`;
  await sleep(500);
}

async function startMergeSort() {
  status.innerText = "Initial Array Inserted!";
  displayArray([...array]);
  await sleep(1500);

  await mergeSort(array, 0, array.length - 1);

  status.innerText = "Sorted Array!";
  displayArray(array);
}
