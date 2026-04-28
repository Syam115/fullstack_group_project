const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    description: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
