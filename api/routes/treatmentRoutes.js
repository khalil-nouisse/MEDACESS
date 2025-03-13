const express = require("express");
const { addTreatment } = require("../controllers/treatmentController");
const router = express.Router();

router.post("/add-treatment", addTreatment);

module.exports = router;