const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    cin: { type: String, required: true },
    type: { type: Number, required: true, default: 0 }, // Default should be a valid number
    descript: { type: String, required: true },
    notes: { type: String },
    date: { type: Date, required: true, default: Date.now }, // Fixed Date type and default value
    addedBy: { type: String, required: true }, // The Doti of the Doctor/owner who declares this Treatment
    priority: { type: Number, required: true, default: 0 },
    resolved: { type: Boolean, required: true, default: false }    
});

module.exports = mongoose.model('Treatment', TreatmentSchema, 'Treatments');