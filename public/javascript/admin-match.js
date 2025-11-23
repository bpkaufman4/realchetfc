getElem('managePlayersBtn').addEventListener('click', getBoxScoreInfo);
getElem('saveMatchBtn').addEventListener('click', setBoxScore);
getElem('manageModifiersBtn').addEventListener('click', getBaseScoreModifiers);
getElem('addModifierBtn').addEventListener('click', addBaseScoreModifier);

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

// Base Score Modifier functions
function getBaseScoreModifiers() {
    fetch(getVal('basepath') + 'api/base-score-modifier/getForMatch/' + getVal('matchId'))
        .then(response => response.json())
        .then(modifiers => {
            renderBaseScoreModifiers(modifiers);
        })
        .catch(err => {
            console.error('Error fetching base score modifiers:', err);
        });
}

function renderBaseScoreModifiers(modifiers) {
    const tbody = getElem('baseScoreModifierList');
    tbody.innerHTML = '';
    
    modifiers.forEach(modifier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${modifier.player.firstName} ${modifier.player.lastName}</td>
            <td>
                <input type="number" class="form-control form-control-sm" value="${modifier.modifier}" 
                       onchange="updateBaseScoreModifier('${modifier.baseScoreModifierId}', this.value)">
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteBaseScoreModifier('${modifier.baseScoreModifierId}')">
                    Remove
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addBaseScoreModifier() {
    const playerId = getVal('playerSelect');
    const modifier = parseInt(getVal('modifierValue'));
    const matchId = getVal('matchId');
    
    if (!playerId) {
        alert('Please select a player');
        return;
    }
    
    if (isNaN(modifier)) {
        alert('Please enter a valid modifier value');
        return;
    }
    
    const request = {
        playerId: playerId,
        matchId: matchId,
        modifier: modifier
    };
    
    fetch(getVal('basepath') + 'api/base-score-modifier/upsert', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            // Clear form
            getElem('playerSelect').value = '';
            getElem('modifierValue').value = '';
            // Refresh list
            getBaseScoreModifiers();
        } else {
            alert('Error adding modifier: ' + result.message);
        }
    })
    .catch(err => {
        console.error('Error adding base score modifier:', err);
        alert('Error adding modifier');
    });
}

function updateBaseScoreModifier(baseScoreModifierId, newModifier) {
    const modifier = parseInt(newModifier);
    
    if (isNaN(modifier)) {
        alert('Please enter a valid modifier value');
        getBaseScoreModifiers(); // Reset the display
        return;
    }
    
    const request = { modifier: modifier };
    
    fetch(getVal('basepath') + 'api/base-score-modifier/update/' + baseScoreModifierId, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status !== 'success') {
            alert('Error updating modifier: ' + result.message);
            getBaseScoreModifiers(); // Reset the display
        }
    })
    .catch(err => {
        console.error('Error updating base score modifier:', err);
        alert('Error updating modifier');
        getBaseScoreModifiers(); // Reset the display
    });
}

function deleteBaseScoreModifier(baseScoreModifierId) {
    if (!confirm('Are you sure you want to remove this base score modifier?')) {
        return;
    }
    
    fetch(getVal('basepath') + 'api/base-score-modifier/delete/' + baseScoreModifierId, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            getBaseScoreModifiers(); // Refresh list
        } else {
            alert('Error deleting modifier: ' + result.message);
        }
    })
    .catch(err => {
        console.error('Error deleting base score modifier:', err);
        alert('Error deleting modifier');
    });
}
