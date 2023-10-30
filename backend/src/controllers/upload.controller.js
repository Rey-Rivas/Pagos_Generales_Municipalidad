const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Chequea que el archivo sea pdf
function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Solamente se permiten archivos PDF');
    }
}

exports.upload = upload.single('documento');

const fs = require('fs');

function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File has been deleted');
    });
}

exports.uploadPDF = (req, res) => {
    res.json({
        message: 'Archivo subido con éxito',
        data: req.file
    });
}