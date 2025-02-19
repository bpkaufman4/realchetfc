var DateTime = luxon.DateTime;
var addMode;
Dropzone.options.dropzone = {
    uploadMultiple: false,
    chunking: false,
    acceptedFiles: 'image/*',
    success: function(file, response) {
        console.log(file, response);
        let request = {
            image: response.fileName,
            matchId: getVal('matchId')
        };
        fetch('api/match-image/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(response => {
            return response.json();
        })
        .then(reply => {
            console.log(reply);
            fetch('api/match-image/get-for-match/' + getVal('matchId'), {
                method: 'GET'
            })
            .then(response => {
                return response.json();
            })
            .then(reply => {
                console.log(reply);
                handleMatchImages(reply.reply);
            })
        })
    }
}

getElem('addMatchImage').addEventListener('click', () => {
    getElem('dropzone').click();
})

getElem('addMatchBtn').addEventListener('click', () => {
    addMode = 'create';
    const formInputs = getElem('addMatchModal').querySelectorAll('input, select, textarea');
    getElem('editBoxScore').style.display = 'none';
    formInputs.forEach(field => {
        field.value = '';
    });
});
getElem('saveMatchBtn').addEventListener('click', () => {

    const opponent = getVal('opponent');
    const location = getVal('location');
    const startTimeVal = getVal('startTime');

    const startTime = DateTime.fromISO(startTimeVal).toUTC().toSQL({includeOffset: false});

    let request = {opponent, location, startTime};

    if(addMode == 'create') {
        fetch('api/match/create', {
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
            console.log(reply);
            window.location.reload();
        });
    } else {
        fetch('api/match/' + getVal('matchId'), {
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
            console.log(reply);
            window.location.reload();
        });
    }
});

const deleteMatchButtons = document.querySelectorAll('.delete-button');
deleteMatchButtons.forEach(button => {
    button.addEventListener('click', () => {
        fetch('api/match/' + button.dataset.matchId, {
            method: 'DELETE'
        })
        .then(res => {
            return res.json();
        })
        .then(reply => {
            window.location.reload();
        })
    })
});

function handleMatchImages(matchImages) {
    getElem('matchImagesCatch').innerHTML = '';
    matchImages.forEach(mi => {
        const imageDiv = makeElem('div');
        imageDiv.classList.add('d-flex','justify-content-between');

        const image = makeElem('img');
        image.src = mi.url;
        imageDiv.appendChild(image);

        const deleteBtnDiv = makeElem('div');
        deleteBtnDiv.classList.add('d-flex', 'justify-content-center', 'flex-column');


        const deleteBtn = makeElem('button');
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.classList.add('btn', 'btn-primary');
        deleteBtn.addEventListener('click', () => {
            fetch('/api/match-image/' + mi.matchImageId, {
                method: 'DELETE'
            })
            .then(reply => {
                if(reply.status == 'success') imageDiv.remove();
            })
        })

        deleteBtnDiv.appendChild(deleteBtn);
        imageDiv.appendChild(deleteBtnDiv);
        


        getElem('matchImagesCatch').appendChild(imageDiv);
    })
}

const editMatchButtons = document.querySelectorAll('.edit-button');

editMatchButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        addMode = 'update';
        getElem('editBoxScore').style.display = 'block';
        getElem('editBoxScore').href = getElem('editBoxScore').dataset.basepath + 'admin-match/' + button.dataset.matchId;
        getElem('saveMatchBtn').innerHTML = 'Save';
        setVal('matchId', button.dataset.matchId);
        saveMode = 'edit';
        fetch('api/match/' + button.dataset.matchId)
        .then(response => {
            return response.json();
        })
        .then(reply => {
            console.log(reply);
            for(key in reply) {
                switch(key) {
                    case 'startTime':
                        const startTime = DateTime.fromISO(reply[key]);
                        const startTimeValue = startTime.toFormat('yyyy-MM-dd') + 'T' + startTime.toFormat('HH:mm:ss');
                        setVal(key, startTimeValue);
                        break;
                    case 'matchimages':
                        handleMatchImages(reply[key]);
                        break;
                    default:
                        if(getElem(key)) setVal(key, reply[key]);
                }
            }
        })
    })
})