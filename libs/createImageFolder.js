var loger = require('../libs/loger')(module);
var fs = require('fs');
function createImgFolder(){
    "use strict";
    fs.access('uploaded_images', (err) => {
        if(err) {
            loger.info(err, "Creating images directory!");
            fs.mkdir("uploaded_images");
        }
    });
}

module.exports = createImgFolder;