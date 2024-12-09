const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function persistTemporaryFile(fileName, targetDirectory = 'images') {
    return new Promise((resolve, reject) => {
        fs.copyFile('./public/tempImages/' + fileName, './public/' + targetDirectory + '/' + fileName, (err) => {
            if(err) {
                resolve({status: 'fail', message: 'error copying temporary file', err});
            } else {
                resolve({status: 'success', relativePath: targetDirectory + '/' + fileName});
            }
        });
    })
}

module.exports = { persistTemporaryFile };