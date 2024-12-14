const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const { default: axios } = require('axios');


class BackgroundRemove {
    constructor(filePath, model) {
        this.filePath = filePath;
        const EdenFormData = new FormData();
        
        const extension = path.extname(filePath);
        this.extension = extension;

        const newFileName = path.basename(filePath, extension);

        this.newFileName = newFileName + 'no-bg' + extension;
        
        EdenFormData.append('file', fs.createReadStream(filePath), this.newFileName);

        this.formData = EdenFormData;
    }
    launch() {
        return new Promise((resolve, reject) => {
            axios.post(process.env.EDEN_BG_REMOVE_URL, this.formData, {
                headers: {
                    ...this.formData.getHeaders(),
                    'AUTHORIZATION' : 'Bearer ' + process.env.EDEN_BEARER_TOKEN
                }
            })
            .then(({data}) => {
                resolve(data);
            })
        })
    }
}

module.exports = BackgroundRemove;