const User = require("../models/User");
const Treatment = require('../models/Treatment');
const Reclamation = require('../models/Reclamation');
const nodemailer = require("nodemailer");
const { transporter } = require("../controllers/mailerController");
require("dotenv").config(); 

exports.updateData = async (req, res) => {
    try {
      if (!req.session.user || req.session.role !== 0) {
        return res.status(403).json({ message: 'Access Denied', success: false });
      }
  
      const userId = req.session.user._id; 
      const { code_postal, family_statut, address } = req.body; 
      const updateData = {};
  
      if (code_postal) updateData.code_postal = code_postal;
      if (family_statut) updateData.family_statut = family_statut;
      if (address) updateData.address = address;
  
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          updateData,
          { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  
    } catch (err) {
      return res.status(500).json({ message: err.message, success: false });
    }
  };

exports.displayMyDoctors= async (req, res) => {
   try{
    if (!req.session.user || req.session.role !== 0) {
        return res.status(403).json({ message: 'Access Denied', success: false }).redirect('/403');
    }
    const treatments = await Treatment.find().populate("addedBy", "first_name last_name doti");
    const docs={};
    const seen = new Set();

    treatments.forEach((treatment) => {
        
        const doctor = treatment.addedBy;

        if (doctor && !seen.has(doctor.doti)) { 
            seen.add(doctor.doti);
    
            docs[doctor.doti] = { 
                first_name: doctor.first_name,
                last_name: doctor.last_name,
                doti: doctor.doti
            };
        }
    })
}
   catch(err){
    return res.status(500).json({ message: err.message, success: false });
   }
};

exports.treatmentsDisplay = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(403).json({ message: 'Access Denied', success: false });
    }

    // Fetch treatments by CIN
    const treatments = await Treatment.find({ cin: req.session.user.cin });

    if (treatments.length > 0) {
      return res.status(200).json({ treatments, success: true });
    } else {
      return res.status(404).json({ message: 'No treatments found', success: false });
    }
  } catch (err) {
    console.error('Error fetching treatments:', err);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

exports.treatmentsDisplay2 = async (req, res) => {
  try {
    /*
      if (!req.session.user) {
          return res.status(403).json({ message: 'Access Denied', success: false });
      }*/
     console.log(req.session.user);

      const Treatments = await Treatment.find({ cin: req.session.user.cin});

      if (Treatments.length > 0) {
          return res.status(200).json({ data: Treatments, success: true });
          //return res.render('khalil', { user: req.session.user || null, data: Treatments });
      } else {
          return res.status(400).json({ message: 'There is no treatment added by you', success: false });
      }
  } catch (err) {
      return res.status(500).json({ message: err.message, success: false });
  }
};

exports.sendEmailReclamation = (userEmail, doctorEmail, reclamation , PatientFullName) => {
 
  const mailOptions = {
      from: userEmail,
      to: doctorEmail,
      subject: "Relcamation Report",
      html: `
          <h2>Patient Reclamation !</h2>
          <h3><strong>User ID:</strong> ${PatientFullName}</h3>
          <p><strong>Reclamation :</strong>${reclamation}</p>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error("Error sending email:", error);
      } else {
          console.log(`Reclamation email sent to ${doctorEmail}:`, info.response);
      }
  });
};

exports.Doctorfetch = async (req, res) => {
  try {
    console.log("Request body doctorIDs:", req.body.doctorIDs);
    
    // Check if doctorIDs are provided in the request body
    if (!req.body.doctorIDs || !Array.isArray(req.body.doctorIDs) || req.body.doctorIDs.length === 0) {
      return res.status(400).json({ message: 'No doctor IDs provided', success: false });
    }
    
    // Find users whose doti matches any of the provided doctor IDs
    const doctors = await User.find({ doti: { $in: req.body.doctorIDs } });

    if (doctors.length > 0) {
      return res.status(200).json({ data: doctors, success: true });
    } else {
      return res.status(400).json({ message: 'No doctors found with the provided IDs', success: false });
    }
  } catch (err) {
    console.error("Error in Doctorfetch:", err);
    return res.status(500).json({ message: err.message, success: false });
  }
};

