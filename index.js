function onTextChanged(e) {
    document.getElementById("display-area").innerHTML = e.target.value;
}

document.getElementById("svg-edit").addEventListener("input", onTextChanged);
document.getElementById("svg-edit").dispatchEvent(new Event("input"));
