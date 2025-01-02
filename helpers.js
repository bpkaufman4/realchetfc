const fs = require('fs');

function persistTemporaryFile(fileName, targetDirectory = 'images') {
    try {
        if (!fs.existsSync('public/'+targetDirectory)) {
            fs.mkdirSync('public/'+targetDirectory);
        }
    } catch (err) {
        console.error(err);
    }
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

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

module.exports = { persistTemporaryFile, getFlagEmoji };