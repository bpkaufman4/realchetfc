const router = require('express').Router();
const { Position } = require('../../models');

router.get('/:id', (req, res) => {
    Position.findOne({where: {positionId: req.params.id}})
    .then(dbData => {
        if(dbData) {
            const cleanData = dbData.get({plain: true});
            res.json(cleanData);
        } else {
            res.json({status: 'fail', message: 'no player found'});
        }
    })
    .catch(err => {
        console.error(err);
        res.json({status: 'fail', message: err.message});
    })
})
router.post('/create', (req, res) => {
    
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }
    
    let request = req.body;
    Position.create(request)
    .then(reply => {
        res.json({status: 'success', reply});
    })
    .catch(err => {
        res.json({status: 'fail', err});
    })
});

router.patch('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }
    
    let request = req.body;

    Position.update(request, {where: {positionId: req.params.id}})
    .then(reply => {
        res.json({status: 'success', reply});
    })
    .catch(err => {
        res.json({status: 'fail', err});
    })
});

router.delete('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    Position.destroy({where: {positionId: req.params.id}})
    .then(reply => {
        res.json({status: 'success', reply});
    })
    .catch(err => {
        res.json({status: 'fail', err});
    })
})

module.exports = router;