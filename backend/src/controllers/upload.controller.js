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
    const filetypes = /pdf|png|jpeg|jpg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Solamente se permiten archivos PDF y de imagen');
    }
}

exports.upload = upload.single('documento');

exports.uploadPDF = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    
    res.json({
        message: 'Archivo subido con éxito',
        data: req.file
    });
}