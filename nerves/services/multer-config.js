import multer from "multer";
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // make sure this folder exists
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname) || '.wav';
        cb(null, `audio-${Date.now()}${ext}`);
    },
});

function multerUploadStorage() {
    return multer({ storage });
}

module.exports = { multerUploadStorage };