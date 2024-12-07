const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Position, Player } = require('../models');
router.get('/', (req, res) => {
    const templateData = {}
    res.render('home', templateData);
});

router.get('/playerAdd', (req, res) => {
    res.render('playerAdd');
});

router.post('/uploadFile', async (req, res) => {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, info) {
        console.log(info.filename);
        console.log("Uploading: " + info.filename);
        //Path where image will be uploaded
        let filename = uuidv4() + path.extname(info.filename);
        fstream = fs.createWriteStream('public/tempImages/' + filename);
        const url = process.env.BASEPATH + 'public/tempImages/' + filename;
        file.pipe(fstream);
        fstream.on('close', function () {    
            console.log("Upload Finished of " + filename);              
            res.json({status: 'success', filename, url});
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
})
router.get('/admin', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }
    res.render('admin', {layout: 'admin'});
});

router.get('/admin-players', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }
    const positions = Position.findAll()
    .then(dbData => {
        let dbDataClean = dbData.map(position => position.get({plain: true}));
        return dbDataClean;
    });
    
    const players = Player.findAll({include: Position})
    .then(dbData => {
        let dbDataClean = dbData.map(player => player.get({plain: true}));
        return dbDataClean;
    })

    Promise.all([positions, players])
    .then(data => {
        console.log(data[1][0]);
        res.render('admin-players', {layout: 'admin', data: {positions: data[0], players: data[1]}});
    })
});

module.exports = router;