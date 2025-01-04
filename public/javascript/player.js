const miniNavOptions = document.querySelectorAll('.mini-nav-option');
const miniContainers = document.querySelectorAll('.mini-container');

miniNavOptions.forEach(o => {
    o.addEventListener('click', e => {
        miniNavOptions.forEach(o2 => {
            o2.classList.remove('active');
        });
        o.classList.add('active');
        
        miniContainers.forEach(c => {
            c.classList.remove('active');
        })
        getElem(o.dataset.target).classList.add('active');
    })
})