var imageChanged = false;
var saveMode = 'add';
var DateTime = luxon.DateTime;
getElem('addPlayerBtn').addEventListener('click', () => {
    saveMode = 'add';
    getElem('savePlayerBtn').innerHTML = 'Add Player';
    imageChanged = false;

    getElem('playerHeadShot').style.backgroundImage = '';
    getElem('playerHeadShot').innerHTML = 'Add Image';
    const formInputs = getElem('addPlayerModal').querySelectorAll('input, select, textarea');
    formInputs.forEach(field => {
        field.value = '';
    });
});
getElem('savePlayerBtn').addEventListener('click', () => {
    const firstName = getVal('firstName');
    const lastName = getVal('lastName');
    const positionId = getVal('positionId');
    const bio = getVal('bio');
    const image = getVal('image');
    const number = getVal('number');
    const heightFeet = getVal('heightFeet');
    const heightInches = getVal('heightInches');
    const homeTown = getVal('homeTown');
    const birthday = getVal('birthday');
    const collegeId = getVal('collegeId');

    let request = {firstName, lastName, positionId, bio, number, heightFeet, heightInches, homeTown, birthday, collegeId};

    if(imageChanged) request.image = image;

    for(key in request) {
        if(!request[key]) delete request[key];
    }

    if(saveMode == 'add') {
        fetch('api/player/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => {
            return  response.json();
        })
        .then(() => {
            window.location.reload();
        });
    } else {
        fetch('api/player/'+getVal('playerId'), {
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
            window.location.reload();
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
        getElem('playerHeadShot').style.backgroundImage = `url('${response.url}')`;
        getElem('playerHeadShot').innerHTML = '';
        setVal('image', response.fileName);
    }
}

getElem('playerHeadShot').addEventListener('click', () => {
    getElem('dropzone').click();
});

const editPlayerButtons = document.querySelectorAll('.edit-button');
editPlayerButtons.forEach(button => {
    button.addEventListener('click', () => {    
        getElem('playerHeadShot').innerHTML = '';
        getElem('savePlayerBtn').innerHTML = 'Save';
        imageChanged = false;
        setVal('playerId', button.dataset.playerId);
        saveMode = 'edit';
        fetch('api/player/' + button.dataset.playerId)
        .then(response => {
            return response.json();
        })
        .then(reply => {
            console.log(reply);
            for(key in reply) {
                switch(key) {
                    case 'image':
                        if(reply[key]) {
                            getElem('playerHeadShot').style.backgroundImage = `url('${reply[key]}')`;
                        } else {
                            getElem('playerHeadShot').innerHTML = 'Add Image'
                        }
                        setVal(key, reply[key]);
                        break;
                    case 'birthday':
                        let birthday = DateTime.fromISO(reply[key]).toUTC().toFormat('y-LL-dd');
                        setVal(key, birthday);
                        break;
                    default:
                        if(getElem(key)) setVal(key, reply[key]);
                        break;
                }
            }
        })
    })
})

const deletePlayerButtons = document.querySelectorAll('.delete-button');
deletePlayerButtons.forEach(button => {
    button.addEventListener('click', () => {
        fetch('api/player/' + button.dataset.playerId, {
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