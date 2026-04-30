const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === 'profileImage') cb(null, 'uploads/doctor-profiles/');
        else if (file.fieldname === 'prescriptionFile') cb(null, 'uploads/prescriptions/');
        else cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });
module.exports = upload;
//this middleware handles file uploads for doctor profiles
// images and prescription files.