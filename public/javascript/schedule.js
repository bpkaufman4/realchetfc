const matches = document.querySelectorAll('[data-match-id].match-card');

matches.forEach(m => {
    m.addEventListener('click', () => {
        window.location.assign('match/' + m.dataset.matchId);
    })
})