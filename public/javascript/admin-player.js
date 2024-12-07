Dropzone.options.dropzone = {
    uploadMultiple: false,
    chunking: true,
    acceptedFiles: 'image/*',
    init: function() {
        this.on("success", file => {
            console.log(file);
        })
    },
    success: function(file, response) {
        console.log(file, response);
    }
}