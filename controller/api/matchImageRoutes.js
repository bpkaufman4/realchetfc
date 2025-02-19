const router = require('express').Router();
const uploadCloudFlare = require('../../cloudflare');
const { MatchImage } = require('../../models');

router.get('/get-for-match/:matchId', (req, res) => {
    MatchImage.findAll({
        where: {
            matchId: req.params.matchId
        }
    })
    .then(dbData => {
        return dbData.map(image => image.get({plain: true}));
    })
    .then(images => {
        res.json({status: 'success', reply: images});
    })
    .catch(err => {
        res.json({status: 'error', reply: err});
    })
})
router.post('/create', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    let newMatchImage = req.body;

    uploadCloudFlare('./public/tempImages/'+ newMatchImage.image)
    .then(reply => {
        if(reply.success) {
            newMatchImage.url = reply.result.variants[0];
            MatchImage.create(newMatchImage)
            .then(result => {
                res.json(result);
            });
        } else {
            console.log(reply);
            res.json({status: 'fail', reply});
        }
    })
    

});

router.patch('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    const newMatchImage = req.body;

    MatchImage.update(newMatchImage, {where: {matchImageId: req.params.id}})
    .then(result => {
        res.json(result);
    });

})

router.delete('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    MatchImage.destroy({where: {matchImageId: req.params.id}})
    .then(dbData => {
        res.json(dbData);
    })
})

module.exports = router;