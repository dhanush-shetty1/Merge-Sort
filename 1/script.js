const visualization = document.getElementById("visualization");
const explanation = document.getElementById("explanation");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createTreeLevel(groups, className = "") {
  const level = document.createElement("div");
  level.className = "level";
  groups.forEach(group => {
    const box = document.createElement("div");
    box.className = "box";
    if (className) box.classList.add(className);
    box.textContent = group.join("    ");
    level.appendChild(box);
  });
  visualization.appendChild(level);
}

function buildLevels(inputArr) {
  let levels = [];
  let current = [inputArr];

  while (current.some(arr => arr.length > 1)) {
    levels.push([...current]);
    let next = [];
    for (let arr of current) {
      if (arr.length <= 1) {
        next.push(arr);
        continue;
      }
      let mid = Math.floor(arr.length / 2);
      next.push(arr.slice(0, mid));
      next.push(arr.slice(mid));
    }
    current = next;
  }
  levels.push([...current]);

  while (current.length > 1) {
    let next = [];
    for (let i = 0; i < current.length; i += 2) {
      if (i + 1 < current.length) {
        const merged = merge(current[i], current[i + 1]);
        next.push(merged);
      } else {
        next.push(current[i]); 
      }
    }
    levels.push([...next]);
    current = next;
  }

  return levels;
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

async function startSort() {
  visualization.innerHTML = "";
  explanation.textContent = "";

  const input = document.getElementById("userInput").value;
  const numbers = input.split(",").map(x => parseInt(x)).filter(x => !isNaN(x));

  if (numbers.length < 2) {
    alert("Enter at least 2 numbers, separated by commas.");
    return;
  }

  explanation.textContent = `Building merge sort tree for: [${numbers}]`;

  const allLevels = buildLevels(numbers);

  for (let i = 0; i < allLevels.length; i++) {
    if (i === allLevels.length - 1) {
      createTreeLevel(allLevels[i], "merged");
    } else if (i === 0) {
      createTreeLevel(allLevels[i], "highlight");
    } else {
      createTreeLevel(allLevels[i]);
    }
    await sleep(1500);
  }

  explanation.textContent = `Final Sorted Array: [${numbers.sort((a, b) => a - b)}]`;
}