const express = require("express");
const { getLastFiveReclamations } = require("../controllers/reclamationController");
const router = express.Router();

router.get("/last-five", getLastFiveReclamations);

module.exports = router;
