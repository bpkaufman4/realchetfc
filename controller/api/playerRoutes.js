const router = require('express').Router();
const { Player } = require('../../models');
const uploadCloudFlare = require('../../cloudflare');

router.get('/:id', (req, res) => {
    Player.findOne({where: {playerId: req.params.id}})
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
        res.json({status: 'error', message: err.message});
    })
})
router.post('/create', (req, res) => {
    
    function createPlayer(newPlayer) {
        Player.create(newPlayer)
        .then(result => {
            res.json(result);
        });
    }

    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    let request = req.body;

    if(request.image) {

        // const PlayerNoBackground = new BackgroundRemove(request.image);

        uploadCloudFlare('./public/tempImages/'+ request.image)
        .then(reply => {
            if(reply.success) {
                request.image = reply.result.variants[0];
                createPlayer(request);
            } else {
                console.log(reply);
                res.json({status: 'fail', reply});
            }
        })
    } else {
        createPlayer(request);
    }

});

router.patch('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }
    
    
    function updatePlayer(newPlayer) {
        Player.update(newPlayer, {where: {playerId: req.params.id}})
        .then(result => {
            res.json(result);
        });
    }

    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    let request = req.body;

    if(request.image) {
        uploadCloudFlare('./public/tempImages/'+ request.image)
        .then(reply => {
            if(reply.success) {
                request.image = reply.result.variants[0];
                updatePlayer(request);
            } else {
                console.log(reply);
                res.json({status: 'fail', reply});
            }
        })

    } else {
        updatePlayer(request);
    }
})

router.delete('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    Player.destroy({where: {playerId: req.params.id}})
    .then(dbData => {
        res.json(dbData);
    })
})

module.exports = router;