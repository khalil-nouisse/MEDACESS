const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateData = async (req, res) => {
    try {
      if (!req.session.user ) {
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