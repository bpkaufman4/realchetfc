const router = require('express').Router();
const { Player } = require('../../models');
router.get('', (req, res) => {
    res.json({reply: 'hello'});
})
router.post('/create', (req, res) => {
    Player.create(req.body)
    .then(result => {
        res.json(result);
    });
});

module.exports = router;