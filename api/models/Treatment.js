const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true},
    cin: { type: String, required: true, unique: true },
    type: {type: String, required: true, default: ""},
    descript: {type: String, required: true},
    notes: {type: String},
    date: {type: date, required: true, default: today()},
    addedBy: {type: String, required: true}, // the Doti of the Doctor/owner who declare this Treatment
    priority: {type: Number, required: true, default: 0},
    resolved: {type: Boolean, required: true, default: false}    
});

module.exports = mongoose.model('Treatment', TreatmentSchema);
