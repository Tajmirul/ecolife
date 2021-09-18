const fs = require('fs');
const path = require('path');

module.exports.deleteFile = (filePath) => {
    const absolutePath = path.join(__dirname, '..', filePath);
    // console.log(absolutePath);
    // return;

    fs.unlink(absolutePath, (err) => {
        if (err) {
            throw (err);
        }
        console.log('File deleted!');
    });
};
