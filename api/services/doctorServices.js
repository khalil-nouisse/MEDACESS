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
    try{
        if (!req.session.user || req.session.role !== 1) {
            return res.status(403).json({ message: 'Access Denied', success: false });
        }
        const {} = req.body;

    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
    
};

