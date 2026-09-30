const svgEdit = document.getElementById("svg-edit");
const textDisplay = document.getElementById("highlight-content");
const displayArea = document.getElementById("display-area");

function onTextChanged(e) {
    textDisplay.innerHTML = e.target.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    displayArea.innerHTML = e.target.value;

    textDisplay.removeAttribute('data-highlighted');
    hljs.highlightAll();
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
