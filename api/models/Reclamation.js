const mongoose = require('mongoose');
 
 const ReclamationSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref:'User' , required: true },
     doctor: { type: mongoose.Schema.Types.ObjectId , ref: 'User', required: true},
     title: { type: String, required: true }, 
     description: { type: String, required: true },
     status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
     createdAt: { type: Date, default: Date.now }
 });
 
 module.exports = mongoose.model('Reclamation', ReclamationSchema , "Reclamation");