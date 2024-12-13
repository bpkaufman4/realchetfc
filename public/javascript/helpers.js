function getElem(id) {
    return document.getElementById(id);
}

function getVal(id, ifFalse = null) {
    return (getElem(id).value) ? getElem(id).value : ifFalse;
}

function setVal(id, value) {
    getElem(id).value = value;
}

function makeElem(tag, id='') {
    const elementToReturn = document.createElement(tag);
    elementToReturn.id = id;
    return elementToReturn;
}

function clearHTML(id) {
    console.log(typeof id);
    if(typeof id === 'string') {
        getElem(id).innerHTML = '';
    } else if (typeof id === 'object') {
        id.forEach(elem => {
            getElem(elem).innerHTML = '';
        })
    }
}