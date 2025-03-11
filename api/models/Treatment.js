const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true},
    cin: { type: String, required: true, unique: true },
    sexe: { type: Boolean, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tel: { type: String, required: true },
    doti: { type: String },
    address: { type: String},
    code_postal: {type: Number},
    family_statut: {type: String},
    role: {type: Number, required: true},
    profil_img: {type: String, default: png},
});

module.exports = mongoose.model('Treatment', TreatmentSchema);
