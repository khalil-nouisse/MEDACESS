const Treatment = require('../models/Treatment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exists } = require('../models/User');

const User = require("../models/User");
const treatment = require("../models/Treatment");

// Function to display the last 5 important Treatments
exports.treatments3Display = async (req, res) => {
    try {
        if (!req.session.user || req.session.role !== 1) {
            return res.status(403).json({ message: 'Access Denied', success: false }).redirect('/403');
        }

        const DocTreatments = await treatment.find({ addedBy: req.session.doti, solved: false }).sorted({ priority: -1}).limit(5);

        if (DocTreatments.length > 0) {
            return res.status(200).json({ data: DocTreatments, success: true });
        } else {
            return res.status(400).json({ message: 'There is no treatment added by you', success: false });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

exports.addTreatment = async (req, res) => {
    try {
        const { cin, name, age, gender, bloodType, type, description, medications } = req.body;
        const doctorId = req.session.user ? req.session.user._id : null;

        if (!doctorId) {
            return res.status(401).json({ message: "Unauthorized: Doctor not logged in." });
        }

        let patient = await User.findOne({ cin });

        if (!patient) {
            // Create a new patient in case not existing
            patient = new User({ cin, name, age, gender, bloodType, role: "Patient" });
            await patient.save();
        } else {
            // Update missing patient info
            if (!patient.bloodType && bloodType) patient.bloodType = bloodType;
            if (!patient.age && age) patient.age = age;
            if (!patient.gender && gender) patient.gender = gender;
            await patient.save();
        }

        // Create a new treatment record
        const newTreatment = new treatment({
            patient: patient._id,
            doctor: doctorId,
            type,
            description,
            medications: type === "Ordonnance" ? medications : []
        });

        await newTreatment.save();

        res.status(201).json({ message: "Treatment added successfully", treatment: newTreatment });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

