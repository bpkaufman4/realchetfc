const router = require('express').Router();
const { College } = require('../../models');
const { persistTemporaryFile } = require('../../helpers');
// const BackgroundRemove = require('../../eden');

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
        College.create(newCollege)
        .then(result => {
            res.json(result);
        });
    }

    if(!req.session.admin) {
        res.json({status: 'fail', message: 'must be admin'});
        return;
    }

    let request = req.body;

    if(request.logoUrl) {

        // const PlayerNoBackground = new BackgroundRemove(request.image);

        persistTemporaryFile(request.logoUrl, 'collegeLogos')
        .then(reply => {
            if(reply.status === 'success') {
                request.logoUrl = reply.relativePath;
                createCollege(request);
            } else {
                console.log(reply);
                res.json({status: 'fail', reply});
            }
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
        persistTemporaryFile(request.logoUrl, 'collegeLogos')
        .then(reply => {
            if(reply.status === 'success') {
                request.logoUrl = reply.relativePath;

                // const PlayerNoBackground = new BackgroundRemove('public/'+request.image, 'Player');

                // PlayerNoBackground.launch()
                // .then(result => {
                //     console.log(result);
                // });

                updateCollege(request);
            } else {
                console.log(reply);
                res.json({status: 'fail', reply});
            }
        });

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
})

module.exports = router;