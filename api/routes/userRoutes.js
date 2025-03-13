const express = require('express');
const { updateData } = require('../controllers/userController');
const { addNewTreatment } = require('../services/doctorServices');
const { sendEmailReclamation , treatmentsDisplay } = require('../services/patientServices');
const router = express.Router();

router.post('/update', updateData);
router.get('/addTreatments',addNewTreatment);
router.post('/reportReclamation', sendEmailReclamation);
router.get('/khalil', treatmentsDisplay);
module.exports = router;