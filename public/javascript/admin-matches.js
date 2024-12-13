var DateTime = luxon.DateTime;

getElem('addMatchBtn').addEventListener('click', () => {
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
        // window.location.reload();
    });
})

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

const editMatchButtons = document.querySelectorAll('.edit-button');

editMatchButtons.forEach(button => {
    button.addEventListener('click', () => {
        
    
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
                    default:
                        if(getElem(key)) setVal(key, reply[key]);
                }
            }
        })
    })
})