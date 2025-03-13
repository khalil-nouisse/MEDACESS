const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: Number, required: true, default: 0 }, // Default should be a valid number
    descript: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }, // Fixed Date type and default value
    addedBy: { type: String, required: true }, // The Doti of the Doctor/owner who declares this Treatment
    priority: { type: Number, required: true, default: 0 },
    resolved: { type: Boolean, required: true, default: false } ,   
    // Fields for ordonnance (prescriptions)
    medications: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            status: { type: String, enum: ["Pending", "Bought"], default: "Pending" }
        }
    ]
});

module.exports = mongoose.model('Treatment', TreatmentSchema, 'Treatments');
