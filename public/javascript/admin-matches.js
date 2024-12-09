var DateTime = luxon.DateTime;
getElem('addMatchBtn').addEventListener('click', () => {
    const formInputs = getElem('addPlayerModal').querySelectorAll('input, select, textarea');
    formInputs.forEach(field => {
        field.value = '';
    });
});
getElem('saveMatchBtn').addEventListener('click', () => {
    const opponent = getVal('opponent');
    const location = getVal('location');
    const startTime = getVal('startTime');

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
    .then(() => {
        window.location.reload();
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
})