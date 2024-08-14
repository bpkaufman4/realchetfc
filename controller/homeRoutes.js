const router = require('express').Router();

router.get('/', (req, res) => {
    const templateData = {}
    res.render('homepage', templateData);
});

module.exports = router;