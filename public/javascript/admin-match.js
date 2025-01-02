getElem('managePlayersBtn').addEventListener('click', getBoxScoreInfo);
getElem('saveMatchBtn').addEventListener('click', setBoxScore);

function setBoxScore() {
    const rows = getElem('boxScoreCatch').querySelectorAll('tr');
    let boxScores = [];
    rows.forEach(r => {
        let boxScore = {
            goals: r.querySelector('[data-stat="goals"]').value,
            assists: r.querySelector('[data-stat="assists"]').value,
            mvp: r.querySelector('[data-stat="mvp"]').checked,
            playerId: r.dataset.playerId
        };
        boxScores.push(boxScore);
    });

    const ourScore = getVal('ourScore');
    const opponentScore = getVal('opponentScore');

    const request = {
        ourScore,
        opponentScore,
        boxScores,
        matchId: getVal('matchId')
    }

    fetch(getVal('basepath')+'api/boxScore/setForMatch',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        }
    )
    .then(response => {
        return response.json();
    })
    .then(() => {
        getBoxScoreInfo();
    })

}

function getBoxScoreInfo() {
    const unplayed = fetch(getVal('basepath') + 'api/boxScore/unplayedPlayers/' + getVal('matchId'))
    .then(response => {
        return response.json();
    });

    const boxScore = fetch(getVal('basepath') + 'api/boxScore/getForMatch/' + getVal('matchId'))
    .then(response => {
        return response.json();
    });

    Promise.all([unplayed, boxScore])
    .then(data => {
        clearHTML(['boxScoreCatch', 'unplayedCatch']);
        const unplayed = data[0];
        const boxScore = data[1];

        unplayed.forEach(p => {
            const playerContainer = makeElem('div');
            playerContainer.classList.add('mb-3');
            const addButton = makeElem('button');
            addButton.classList.add('btn', 'btn-outline-light', 'me-3');
            addButton.innerHTML = '+';

            const playerId = p.playerId;
            const request = {playerId, matchId: getVal('matchId')};

            addButton.addEventListener('click', () => {
                fetch(getVal('basepath')+'api/boxScore/create',
                    {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(request)
                    }
                )
                .then(response => {
                    return response.json();
                })
                .then(() => {
                    getBoxScoreInfo();
                })
            });

            const playerName = makeElem('span');
            playerName.innerHTML = `${p.firstName} ${p.lastName}`;

            playerContainer.appendChild(addButton);
            playerContainer.appendChild(playerName);
            getElem('unplayedCatch').appendChild(playerContainer);
        })

        boxScore.forEach(bs => {
            console.log(bs);
            const tableRow = makeElem('tr');
            tableRow.dataset.playerId = bs.player.playerId;
            const mvpChecked = bs.mvp ? ' checked ' : '';
            tableRow.innerHTML = `<td>${bs.player.firstName} ${bs.player.lastName}</td>
                <td><input class="form-control" type="number" step="1" min="0" data-stat="goals" value="${bs.goals}"></td>
                <td><input class="form-control" type="number" step="1" min="0" data-stat="assists" value="${bs.assists}"></td>
                <td><input class="form-check-input" type="checkbox" data-stat="mvp" ${mvpChecked}></td>`;

            const removeButtonContainer = makeElem('td');
            const removeButton = makeElem('button');
            removeButton.classList.add('btn', 'btn-primary');
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', () => {
                fetch(getVal('basepath') + 'api/boxScore/delete/'+bs.boxScoreId, {
                    method: 'DELETE'
                })
                .then(response => {
                    return response.json();
                })
                .then(() => {
                    getBoxScoreInfo();
                })
            })

            removeButtonContainer.appendChild(removeButton);
            tableRow.appendChild(removeButtonContainer);

            getElem('boxScoreCatch').appendChild(tableRow);
        
        })
    })
}
