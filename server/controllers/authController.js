const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    const { name, email, password, phone, date_of_birth, role } = req.body;
    try {
        if (role !== 'patient') return res.status(400).json({ message: 'Only patients can register here' });
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, phone, date_of_birth, role });
        res.status(201).json({
            _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id, user.role)
        });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.registerDoctor = async (req, res) => {
    const {
        name,
        email,
        password,
        specialization,
        experience,
        hospital,
        location,
        fee,
        availableSlots
    } = req.body;

    try {
        const doctorExists = await Doctor.findOne({ email });
        if (doctorExists) return res.status(400).json({ message: 'Doctor already exists' });

        const doctor = await Doctor.create({
            name,
            email,
            password,
            specialization,
            experience,
            hospital,
            location,
            fee,
            availableSlots: Array.isArray(availableSlots) ? availableSlots : [],
            approvalStatus: 'Pending'
        });

        const admins = await Admin.find({}).select('_id');
        if (admins.length > 0) {
            await Notification.insertMany(admins.map((admin) => ({
                userId: admin._id,
                userModel: 'Admin',
                message: `New doctor registration from ${doctor.name} is waiting for approval`,
                sent_at: new Date(),
                status: 'Unread',
                type: 'Doctor Approval',
                channel: 'in-app',
                meta: {
                    doctorId: doctor._id,
                    doctorName: doctor.name,
                    approvalStatus: 'Pending'
                }
            })));
        }

        res.status(201).json({
            _id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            role: 'doctor',
            approvalStatus: doctor.approvalStatus,
            message: 'Doctor registration submitted for admin approval'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        let user;
        if (role === 'patient') user = await User.findOne({ email });
        else if (role === 'doctor') user = await Doctor.findOne({ email });
        else if (role === 'admin') user = await Admin.findOne({ email });
        else return res.status(400).json({ message: 'Invalid role' });

        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        if (role === 'doctor' && user.approvalStatus !== 'Approved') {
            return res.status(403).json({ message: `Doctor account is ${user.approvalStatus.toLowerCase()}. Await admin approval.` });
        }

        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            res.json({ _id: user._id, name: user.name, email: user.email, role: role, token: generateToken(user._id, role) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) { res.status(500).json({ message: error.message }); }
};
//This file handles user authentication for patients, doctors, and admins.
// It provides endpoints for registration and login, including doctor 
// registration which requires admin approval. 
// It also generates JWT tokens for authenticated sessions and sends 
// notifications to admins when a new doctor registers.