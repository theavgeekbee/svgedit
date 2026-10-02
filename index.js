const svgEdit = document.getElementById("svg-edit");
const textDisplay = document.getElementById("highlight-content");
const displayArea = document.getElementById("display-area");
const lineNumbers = document.getElementById("line-numbers");

function getNthValidSibling(startNode, n) {
    let currentNode = startNode;
    let validCount = 0;

    while (currentNode && validCount < n) {
        // 1. Move to the next sibling (skipping any child trees)
        currentNode = currentNode.nextSibling;
        if (!currentNode) break;

        // 2. Skip comment nodes (nodeType 8)
        if (currentNode.nodeType === Node.COMMENT_NODE) {
            continue;
        }

        // 3. Skip whitespace-only text nodes
        if (currentNode.nodeType === Node.TEXT_NODE && !currentNode.textContent.trim()) {
            continue;
        }

        // If it passed the checks, it's a valid node (Element or non-empty Text)
        validCount++;
    }

    return currentNode; // Returns the nth valid node, or null if out of bounds
}

function getLineY(lineNum) {
    const parent = textDisplay.childNodes.item(0);
    const node = getNthValidSibling(parent, lineNum);

    if (!node) {
        return undefined;
    } else if (node.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.selectNodeContents(node);
        return range.getBoundingClientRect().y;
    } else {
        return node.getBoundingClientRect().y;
    }
}

function onTextChanged(e) {
    textDisplay.innerHTML = e.target.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    displayArea.innerHTML = e.target.value;
    textDisplay.removeAttribute('data-highlighted');
    hljs.highlightAll();

    const lineCount = svgEdit.value.split('\n').length;
    lineNumbers.innerHTML = Array.from(
        { length: lineCount },
        (_, i) => {
            return `<div style="top: ${getLineY(i)}px">${i + 1}</div>`
        }
    ).join('');
}

function onKey(e) {
    if (e.key === "Tab") {
        e.preventDefault();

        svgEdit.setRangeText(
            '    ', 
            svgEdit.selectionStart, 
            svgEdit.selectionEnd, 
            'end' // Moves the cursor right after the newly inserted tab
        );

        svgEdit.dispatchEvent(new Event("input"));
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
    }
}

svgEdit.addEventListener("input", onTextChanged);
svgEdit.addEventListener("keydown", onKey)
svgEdit.dispatchEvent(new Event("input"));
