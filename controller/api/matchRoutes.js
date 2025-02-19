const router = require('express').Router();
const { Match, MatchImage } = require('../../models');

router.get('/:id', (req, res) => {
    Match.findOne({
        where: {matchId: req.params.id},
        include: MatchImage
    })
    .then(dbData => {
        if(dbData) {
            const cleanData = dbData.get({plain: true});
            res.json(cleanData);
        } else {
            res.json({status: 'fail', message: 'no Match found'});
        }
    })
    .catch(err => {
        console.error(err);
        res.json({status: 'error', message: err.message});
    })
})
router.post('/create', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    newMatch = req.body;
    Match.create(newMatch)
    .then(result => {
        res.json(result);
    });

});

router.patch('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    const newMatch = req.body;

    Match.update(newMatch, {where: {matchId: req.params.id}})
    .then(result => {
        res.json(result);
    });

})

router.delete('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    Match.destroy({where: {matchId: req.params.id}})
    .then(dbData => {
        res.json(dbData);
    })
})

module.exports = router;