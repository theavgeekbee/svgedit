const svgEdit = document.getElementById("svg-edit");
const textDisplay = document.getElementById("highlight-content");
const displayArea = document.getElementById("display-area");
const lineNumbers = document.getElementById("line-numbers");

const mirror = document.createElement('div');
document.body.appendChild(mirror);

let tops = [];        // y of each logical line's first row, in content coordinates
let dirty = true;

function syncMirror(ta) {
    const cs = getComputedStyle(ta);
    ['fontStyle','fontVariant','fontWeight','fontSize','fontFamily','lineHeight',
        'letterSpacing','wordSpacing','textTransform','textIndent','tabSize',
        'direction','wordBreak','paddingTop','paddingRight','paddingBottom','paddingLeft']
        .forEach(p => (mirror.style[p] = cs[p]));
    Object.assign(mirror.style, {
        position: 'absolute', left: '-9999px', top: '0', visibility: 'hidden',
        contain: 'layout style',
        boxSizing: 'border-box', border: '0',
        whiteSpace: 'pre-wrap', overflowWrap: 'break-word',
        width: ta.clientWidth + 'px',
    });
    dirty = true;
}

function rebuild(ta) {
    const frag = document.createDocumentFragment();
    for (const line of ta.value.split('\n')) {
        const d = document.createElement('div');
        d.textContent = line || '\u200b';
        frag.appendChild(d);
    }
    mirror.replaceChildren(frag);

    tops = Array.from(mirror.children, d => d.offsetTop);
    dirty = false;
}

function lineY(ta, lineNum) {
    if (dirty) rebuild(ta);
    return tops[lineNum] - ta.scrollTop;
}

function onTextChanged(e) {
    textDisplay.innerHTML = e.target.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    displayArea.innerHTML = e.target.value;
    textDisplay.removeAttribute('data-highlighted');
    hljs.highlightAll();

    syncMirror(svgEdit);
    const lineCount = svgEdit.value.split('\n').length;
    lineNumbers.innerHTML = Array.from(
        { length: lineCount },
        (_, i) => {
            return `<div style="top: ${lineY(svgEdit, i)}px">${i + 1}</div>`
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
