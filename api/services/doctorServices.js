const Treatment = require('../models/Treatment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exists } = require('../models/User');

// Function to display the last 5 important Treatment
exports.treatmentsDisplay = async (req, res) => {
    try {
        if (!req.session.user || req.session.role !== 1) {
            return res.status(403).json({ message: 'Access Denied', success: false }).redirect('/403');
        }

        const DocTreatments = await Treatment.find({ addedBy: req.session.doti, solved: false }).sorted({ priority: -1}).limit(5);

        if (DocTreatments.length > 0) {
            return res.status(200).json({ data: DocTreatments, success: true });
        } else {
            return res.status(400).json({ message: 'There is no treatment added by you', success: false });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

exports.addNewTreatment = async (req, res) => {
    try{/*
        if (!req.session.user || req.session.role !== 1) {
            return res.status(403).json({ message: 'Access Denied', success: false });
        }
        const {} = req.body;*/
        const treatments = [
            {
                first_name: "John",
                last_name: "Doe",
                cin: "Nop100",
                type: 1,
                descript: "Patient suffering from fever",
                notes: "Prescribed Paracetamol",
                addedBy: "DR001",
                priority: 2
            },
            {
                first_name: "Jane",
                last_name: "Smith",
                cin: "CD789072",
                type: 3,
                descript: "Fractured left arm",
                notes: "Referred to orthopedics",
                addedBy: "DR002",
                priority: 1
            },
            {
                first_name: "Mark",
                last_name: "Johnson",
                cin: "EF3456444",
                type: 0,
                descript: "Allergic reaction to peanuts",
                notes: "Prescribed antihistamines",
                addedBy: "DR003",
                priority: 3
            }
        ];
        const savedTreatments = await Treatment.insertMany(treatments);
        console.log("Treatments saved successfully:", savedTreatments);
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
    
};

