const playerCards = document.querySelectorAll('[data-player-id]');

playerCards.forEach(p => {
    p.addEventListener('click', e => {
        window.location.assign('player/' + p.dataset.playerId);
    })
})