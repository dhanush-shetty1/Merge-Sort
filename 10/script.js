const visualization = document.getElementById("visualization");
const explanation = document.getElementById("explanation");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class MergeSortVisualizer {
    constructor() {
        this.animationSpeed = 800;
    }

    async startSort() {
        const input = document.getElementById("userInput").value;
        const numbers = input.split(",")
                                    .map(x => parseInt(x.trim()))
                                    .filter(x => !isNaN(x));
        
        if (numbers.length < 2) {
            explanation.textContent = "Enter at least 2 numbers separated by commas";
            return;
        }

        visualization.innerHTML = "";
        explanation.textContent = `Starting merge sort on: [${numbers.join(", ")}]`;
        await sleep(this.animationSpeed);

        await this.visualizeMergeSort(numbers);
    }

    async visualizeMergeSort(array, level = 0, position = 0, parentId = null) {
        const nodeId = `node-${level}-${position}`;
        this.createNode(array, level, position, parentId, nodeId);
        
        if (array.length <= 1) {
            document.getElementById(nodeId).classList.add("leaf");
            await sleep(this.animationSpeed);
            return { array, nodeId };
        }

        explanation.textContent = `Dividing: [${array.join(", ")}]`;
        document.getElementById(nodeId).classList.add("dividing");
        await sleep(this.animationSpeed);

        const mid = Math.floor(array.length / 2);
        const leftArr = array.slice(0, mid);
        const rightArr = array.slice(mid);

        const left = await this.visualizeMergeSort(leftArr, level + 1, position * 2, nodeId);
        const right = await this.visualizeMergeSort(rightArr, level + 1, position * 2 + 1, nodeId);

        explanation.textContent = `Merging: [${left.array.join(", ")}] and [${right.array.join(", ")}]`;
        document.getElementById(nodeId).classList.remove("dividing");
        document.getElementById(nodeId).classList.add("merging");
        await sleep(this.animationSpeed);

        const merged = await this.merge(left.array, right.array, left.nodeId, right.nodeId);
        
        const node = document.getElementById(nodeId);
        node.querySelector(".array-value").textContent = `[${merged.join(", ")}]`;
        node.classList.remove("merging");
        node.classList.add("merged");
        
        explanation.textContent = `Merged into: [${merged.join(", ")}]`;
        await sleep(this.animationSpeed);

        return { array: merged, nodeId };
    }

    async merge(left, right, leftId, rightId) {
        let result = [];
        let i = 0, j = 0;

        if (leftId) document.getElementById(leftId).classList.add("highlight");
        if (rightId) document.getElementById(rightId).classList.add("highlight");
        await sleep(this.animationSpeed);

        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
            explanation.textContent = `Comparing ${left[i-1]} and ${right[j-1]}`;
            await sleep(this.animationSpeed/2);
        }

        result = result.concat(left.slice(i)).concat(right.slice(j));

        if (leftId) document.getElementById(leftId).classList.remove("highlight");
        if (rightId) document.getElementById(rightId).classList.remove("highlight");

        return result;
    }

    createNode(array, level, position, parentId, nodeId) {
        if (!visualization.querySelector(".tree")) {
            visualization.innerHTML = '<div class="tree"></div>';
        }

        let levelContainer = visualization.querySelector(`.level-${level}`);
        if (!levelContainer) {
            levelContainer = document.createElement("div");
            levelContainer.className = `level level-${level}`;
            visualization.querySelector(".tree").appendChild(levelContainer);
        }

        const node = document.createElement("div");
        node.className = "node";
        node.id = nodeId;

        const value = document.createElement("div");
        value.className = "array-value";
        value.textContent = array.length > 1 ? `[${array.join(", ")}]` : array[0];
        node.appendChild(value);

        levelContainer.appendChild(node);

        if (parentId) {
            this.createConnector(parentId, nodeId);
        }
    }

    createConnector(parentId, childId) {
        const parent = document.getElementById(parentId);
        const child = document.getElementById(childId);

        if (parent && child) {
            const connector = document.createElement("div");
            connector.className = "connector";
            parent.appendChild(connector);
        }
    }
}

const visualizer = new MergeSortVisualizer();

function startSort() {
    visualizer.startSort();
}