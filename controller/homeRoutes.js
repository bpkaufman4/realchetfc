const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
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
        fstream = fs.createWriteStream('public/images/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {    
            console.log("Upload Finished of " + filename);              
            res.json({status: 'success', filename});
        });
    });
});

module.exports = router;