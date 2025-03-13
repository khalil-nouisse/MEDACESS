const Reclamation = require("../models/Reclamation");

exports.getLastFiveReclamations = async (req, res) => {
    try {
        const doctorId = req.session.user ? req.session.user._id : null;

        if (!doctorId) {
            return res.status(401).json({ message: "Unauthorized: Doctor not logged in." });
        }

        // Fetch the last 5 reclamations for the logged-in doctor
        const reclamations = await Reclamation.find({ doctor: doctorId , status : "Open"})
            .sort({ createdAt: -1 }) 
            .limit(5)
            .populate("user", "name cin")

        res.status(200).json(reclamations);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};
