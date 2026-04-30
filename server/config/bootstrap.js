const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Hospital = require('../models/Hospital');

const DEFAULT_PORTAL_PASSWORD = process.env.DEFAULT_PORTAL_PASSWORD || 'mockpassword';

const defaultDoctors = [
    {
        doctor_id: 'DOC-001',
        name: 'Dr. Emma Carter',
        specialization: 'Cardiology',
        experience: 12, 
        hospital: 'MediLuxe Heart Institute',
        location: 'Hyderabad',
        fee: 120,
        email: 'doctor1@mediluxe.com',
        availableSlots: ['09:00 AM', '11:30 AM', '03:00 PM'],
        approvalStatus: 'Approved'
    },
    {
        doctor_id: 'DOC-002',
        name: 'Dr. Noah Bennett',
        specialization: 'Dermatology',
        experience: 9,
        hospital: 'MediLuxe Skin Clinic',
        location: 'Bengaluru',
        fee: 90,
        email: 'doctor2@mediluxe.com',
        availableSlots: ['10:00 AM', '01:00 PM', '04:30 PM'],
        approvalStatus: 'Approved'
    },
    {
        doctor_id: 'DOC-003',
        name: 'Dr. Olivia Hayes',
        specialization: 'Neurology',
        experience: 14,
        hospital: 'MediLuxe Neuro Center',
        location: 'Chennai',
        fee: 140,
        email: 'doctor3@mediluxe.com',
        availableSlots: ['08:30 AM', '12:30 PM', '05:00 PM'],
        approvalStatus: 'Approved'
    },
];

const defaultHospitals = [
    {
        hospitalName: 'MediLuxe Heart Institute',
        location: 'Hyderabad',
        contactNumber: '9876543210',
        email: 'care@mediluxeheart.com',
        description: 'Cardiac diagnostics and specialist appointments.'
    },
    {
        hospitalName: 'MediLuxe Skin Clinic',
        location: 'Bengaluru',
        contactNumber: '9876501234',
        email: 'care@mediluxeskin.com',
        description: 'Dermatology consultations and follow-up care.'
    },
    {
        hospitalName: 'MediLuxe Neuro Center',
        location: 'Chennai',
        contactNumber: '9876509876',
        email: 'care@mediluxeneuro.com',
        description: 'Neurology reviews and specialist treatment plans.'
    }
];

const defaultAdmins = [
    {
        admin_id: 'ADMIN-001',
        name: 'Platform Administrator',
        email: 'admin@mediluxe.com',
        phone: '+91 99999 99999',
        password: DEFAULT_PORTAL_PASSWORD,
    },
    {
        admin_id: 'ADMIN-002',
        name: 'Admin User',
        email: 'admin@gmail.com',
        phone: '+91 99999 99998',
        password: 'admin@1234',
    },
];

async function ensureCollections() {
    const models = [User, Doctor, Admin, Appointment, Notification, Hospital];

    for (const model of models) {
        try {
            await model.createCollection();
        } catch (error) {
            if (error.codeName !== 'NamespaceExists') {
                throw error;
            }
        }
    }
}

async function ensureSeedData() {
    for (const hospitalSeed of defaultHospitals) {
        await Hospital.updateOne(
            { hospitalName: hospitalSeed.hospitalName },
            { $set: hospitalSeed },
            { upsert: true }
        );
    }

    for (const doctorSeed of defaultDoctors) {
        const existingDoctor = await Doctor.findOne({ email: doctorSeed.email });

        if (!existingDoctor) {
            await Doctor.create({ ...doctorSeed, password: DEFAULT_PORTAL_PASSWORD });
        } else if (!existingDoctor.password) {
            await Doctor.updateOne({ _id: existingDoctor._id }, { $set: { password: await bcrypt.hash(DEFAULT_PORTAL_PASSWORD, 10) } });
        }
    }

    for (const adminSeed of defaultAdmins) {
        const existingAdmin = await Admin.findOne({ email: adminSeed.email });

        if (!existingAdmin) {
            await Admin.create(adminSeed);
        } else if (!existingAdmin.password) {
            await Admin.updateOne({ _id: existingAdmin._id }, { $set: { password: await bcrypt.hash(adminSeed.password, 10) } });
        }
    }
}

module.exports = async function bootstrap() {
    await ensureCollections();
    await ensureSeedData();

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Bootstrap ready: ${collections.length} collections available`);
};
// This file ensures that all necessary collections are created and 
// seeded with default data if they don't already exist. 
// It is called during server startup to prepare the database for use.