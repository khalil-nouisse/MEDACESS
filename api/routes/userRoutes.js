const express = require('express');
const { updateData } = require('../controllers/userController');
const { addNewTreatment } = require('../services/doctorServices');
const { sendEmailReclamation , treatmentsDisplay, treatmentsDisplay2, Doctorfetch } = require('../services/patientServices');
const router = express.Router();

router.post('/update', updateData);
router.get('/addTreatments',addNewTreatment);
router.post('/reportReclamation', sendEmailReclamation);
router.get('/dash', treatmentsDisplay);
router.get('/dash3', treatmentsDisplay2);
router.post('/dash2', Doctorfetch);
module.exports = router;