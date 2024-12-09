function getElem(id) {
    return document.getElementById(id);
}

function getVal(id, ifFalse = null) {
    return (getElem(id).value) ? getElem(id).value : ifFalse;
}

function setVal(id, value) {
    getElem(id).value = value;
}