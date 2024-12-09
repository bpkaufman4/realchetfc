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
        let fileName = uuidv4() + path.extname(info.filename);
        const relativePath = 'tempImages/' + fileName;
        const url = process.env.BASEPATH + relativePath;
        fstream = fs.createWriteStream('public/' + relativePath);
        file.pipe(fstream);
        fstream.on('close', function () {    
            console.log("Upload Finished of " + fileName);              
            res.json({status: 'success', fileName, url, relativePath});
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
        res.render('admin-players', {layout: 'admin', data: {positions: data[0], players: data[1]}});
    })
});

router.get('/admin-matches', (req, res) => {
    if(!req.session.admin) {
        res.redirect('login');
        return;
    }
    res.render('admin-matches', {layout: 'admin'});
})

module.exports = router;