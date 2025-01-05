const router = require('express').Router();
const { College } = require('../../models');
const { persistTemporaryFile } = require('../../helpers');
const uploadCloudFlare = require('../../cloudflare');

router.get('/:id', (req, res) => {
    College.findOne({where: {collegeId: req.params.id}})
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

    function createCollege(newCollege) {
        console.log(2);
        College.create(newCollege)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json({status: 'fail', err});
        })
    }

    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    let request = req.body;

    if(request.logoUrl) {

        // const PlayerNoBackground = new BackgroundRemove(request.image);

        uploadCloudFlare('./public/tempImages/'+ request.logoUrl)
        .then(reply => {
            console.log(reply.success);
            if(reply.success) {
                request.logoUrl = reply.result.variants[0];
                createCollege(request);
            } else {
                console.log(reply);
                res.json({status: 'fail', reply});
            }
        })
        .catch(err => {
            res.json({status: 'fail', err});
        })
    } else {
        createCollege(request);
    }
});

router.patch('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }
    
    
    function updateCollege(newCollege) {
        console.log(newCollege);
        College.update(newCollege, {where: {collegeId: req.params.id}})
        .then(reply => {
            res.json({status: 'success', reply});
        });
    }

    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    let request = req.body;
    console.log(request);
    if(request.logoUrl) {
        uploadCloudFlare('./public/tempImages/'+ request.logoUrl)
        .then(reply => {
            if(reply.success) {
                request.logoUrl = reply.result.variants[0];
                updateCollege(request);
            } else {
                console.log(reply);
                res.json({status: 'fail', reply});
            }
        })
        .catch(err => {
            res.json({status: 'fail', err});
        })
    } else {
        updateCollege(request);
    }
})

router.delete('/:id', (req, res) => {
    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    College.destroy({where: {collegeId: req.params.id}})
    .then(dbData => {
        res.json(dbData);
    })
    .catch(err => {
        res.json({status: 'fail', err});
    })
})

module.exports = router;