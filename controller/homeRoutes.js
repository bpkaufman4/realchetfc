const router = require('express').Router();

router.get('/', (req, res) => {
    const templateData = {}
    res.render('home', templateData);
});

module.exports = router;