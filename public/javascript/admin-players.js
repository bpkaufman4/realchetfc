document.getElementById('addPlayerBtn').addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const positionId = document.getElementById('positionId').value;
    const request = {firstName, lastName, positionId};
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
    })
})