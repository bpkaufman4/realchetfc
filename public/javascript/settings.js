var imageChanged = false;
var saveMode = 'add';
var DateTime = luxon.DateTime;
getElem('addCollegeBtn').addEventListener('click', () => {
    imageChanged = false;

    getElem('collegeLogo').style.backgroundImage = '';
    getElem('collegeLogo').innerHTML = 'Add Image';
    const formInputs = getElem('addCollegeModal').querySelectorAll('input, select, textarea');
    formInputs.forEach(field => {
        field.value = '';
    });
});

getElem('addPositionBtn').addEventListener('click', () => {
    const formInputs = getElem('addPositionModal').querySelectorAll('input, select, textarea');
    formInputs.forEach(field => {
        field.value = '';
    });
});

getElem('saveCollegeBtn').addEventListener('click', () => {
    const collegeId = getVal('collegeId');
    const name = getVal('collegeName');
    const abbreviation = getVal('collegeAbbreviation');
    const logoUrl= getVal('image');

    let request = {collegeId, name, abbreviation};

    if(imageChanged) request.logoUrl = logoUrl;

    for(key in request) {
        if(!request[key]) delete request[key];
    }

    if(saveMode == 'add') {
        fetch('api/college/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => {
            return  response.json();
        })
        .then(reply => {
            if(reply.status == 'fail') {
                alert('Error saving college')
            } else {
                window.location.reload();
            }
        });
    } else {
        fetch('api/college/'+getVal('collegeId'), {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => {
            return response.json();
        })
        .then(reply => {
            if(reply.status == 'fail') {
                alert('Error saving college')
            } else {
                window.location.reload();
            }
        })
    }
})

getElem('savePositionBtn').addEventListener('click', () => {
    const positionId = getVal('positionId');
    const name = getVal('positionName');
    const abbreviation = getVal('positionAbbreviation');

    let request = {positionId, name, abbreviation};

    for(key in request) {
        if(!request[key]) delete request[key];
    }

    if(saveMode == 'add') {
        fetch('api/position/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => {
            return  response.json();
        })
        .then(reply => {
            if(reply.status == 'fail') {
                alert('Error saving position')
            } else {
                window.location.reload();
            }
        });
    } else {
        fetch('api/position/'+getVal('positionId'), {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => {
            return response.json();
        })
        .then(reply => {
            if(reply.status == 'fail') {
                alert('Error saving college')
            } else {
                window.location.reload();
            }
        })
    }
})

Dropzone.options.dropzone = {
    uploadMultiple: false,
    chunking: true,
    acceptedFiles: 'image/*',
    success: function(file, response) {
        console.log(file, response);
        imageChanged = true;
        getElem('collegeLogo').style.backgroundImage = `url('${response.url}')`;
        getElem('collegeLogo').innerHTML = '';
        setVal('image', response.fileName);
    }
}

getElem('collegeLogo').addEventListener('click', () => {
    getElem('dropzone').click();
});

const editCollegeButtons = document.querySelectorAll('.edit-college-button');
editCollegeButtons.forEach(button => {
    button.addEventListener('click', () => {    
        getElem('collegeLogo').innerHTML = '';
        imageChanged = false;
        setVal('collegeId', button.dataset.collegeId);
        saveMode = 'edit';
        fetch('api/college/' + button.dataset.collegeId)
        .then(response => {
            return response.json();
        })
        .then(reply => {
            console.log(reply);
            for(key in reply) {
                switch(key) {
                    case 'logoUrl':
                        if(reply[key]) {
                            getElem('collegeLogo').style.backgroundImage = `url('${reply[key]}')`;
                        } else {
                            getElem('collegeLogo').style.backgroundImage = `unset`;
                            getElem('collegeLogo').innerHTML = 'Add Image'
                        }
                        setVal('collegeLogo', reply[key]);
                        break;
                    case 'abbreviation':
                        setVal('collegeAbbreviation', reply[key]);
                        break;
                    case 'name':
                        setVal('collegeName', reply[key]);
                        break;
                }
            }
        })
    })
})

const editPositionButtons = document.querySelectorAll('.edit-position-button');
editPositionButtons.forEach(button => {
    button.addEventListener('click', () => {  
        setVal('positionId', button.dataset.positionId);
        saveMode = 'edit';
        fetch('api/position/' + button.dataset.positionId)
        .then(response => {
            return response.json();
        })
        .then(reply => {
            console.log(reply);
            for(key in reply) {
                switch(key) {
                    case 'abbreviation':
                        setVal('positionAbbreviation', reply[key]);
                        break;
                    case 'name':
                        setVal('positionName', reply[key]);
                        break;
                }
            }
        })
    })
})

const deleteCollegeButtons = document.querySelectorAll('.delete-college-button');
deleteCollegeButtons.forEach(button => {
    button.addEventListener('click', () => {
        fetch('api/college/' + button.dataset.collegeId, {
            method: 'DELETE'
        })
        .then(res => {
            return res.json();
        })
        .then(reply => {
            window.location.reload();
        })
    })
})

const deletePositionButtons = document.querySelectorAll('.delete-position-button');
deletePositionButtons.forEach(button => {
    button.addEventListener('click', () => {
        fetch('api/position/' + button.dataset.positionId, {
            method: 'DELETE'
        })
        .then(res => {
            return res.json();
        })
        .then(reply => {
            window.location.reload();
        })
    })
})