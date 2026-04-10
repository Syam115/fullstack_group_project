const mongoose = require('mongoose'); const adminSchema = new mongoose.Schema({ admin_id: String, name: String, email: String, phone: String }); module.exports = mongoose.model('Admin', adminSchema);
