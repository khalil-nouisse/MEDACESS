const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendActivationEmail = require('./mailerController').sendActivationEmail;

exports.register = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        const { first_name, last_name, email, password, tel, CIN, doti } = req.body;

        const fName = first_name.toUpperCase();
        const LName = last_name.toUpperCase();
        const Emaill = email.toUpperCase();
        const sexe = true;
        const family_status = "s";
        let Role = 0;
        if(doti) Role = 1;

        const existingUser = await User.findOne({ $or: [{ email: Emaill }, { cin: CIN }, { tel: tel }] });
        if (existingUser) {
            if (existingUser.email === Emaill) {
                return res.status(400).json({ message: 'User with this email already exists', success: false });
            } else if (existingUser.cin === CIN) {
                return res.status(400).json({ message: 'User with this CIN already exists', success: false });
            } else if (existingUser.tel === tel) {
                return res.status(400).json({ message: 'User with this phone number already exists', success: false });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationToken = crypto.randomBytes(32).toString("hex");
        const user = new User({
            first_name: fName,
            last_name: LName,
            cin: CIN,
            sexe: sexe,
            email: Emaill,
            password: hashedPassword,
            tel: tel,
            doti: doti,
            family_statut: family_status,
            role: Role,
            activationToken,
        });
        //user.isActive = true;
        //user.activationToken = null;

        await user.save();
        sendActivationEmail(email, activationToken);
        res.status(201).json({ message: 'User registered successfully', success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};


exports.login = async (req, res) => {
    try {
        const { emailorcin, password } = req.body;

        let user = await User.findOne({ email: emailorcin.toUpperCase() });
        if (!user) {
            user = await User.findOne({ cin: emailorcin });
            if (!user) {
                return res.status(400).json({ message: "Person not found", success: false });
            }
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        if (!user.isActive) {
            sendActivationEmail(user.email, user.activationToken);
            return res.status(403).json({ message: "Please activate your account first." });
        }
        //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        req.session.user = user;
        return res.status(200).json({ success: true});
    } catch (err) {
        return res.status(500).json({ error: err.message, success: false });
    }
};

exports.logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Logout failed", success: false });
            }
            res.clearCookie("token");
            return res.status(200).redirect("../dash");
            //return res.status(200).json({ message: "Logout successful", success: true });
        });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

exports.activateAccount = async (req, res) => {
    try {
        const token = req.query.key;
        const user = await User.findOne({ activationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid activation token" });
        }

        if (user.isActive) {
            req.session.user = user;
            return res.status(403).redirect('../dash');
        }

        user.isActive = true;
        await user.save();
        req.session.user = user;

        res.status(200).json({ message: "Account activated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.forgotPassword = async (req , res) => {
    try{
        const  { email } = req.body;
        const user = await User.findOne({ email: email.toUpperCase() });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpire = Date.now() + 3600000; // Token valid for 1 hour

        // Hash the token (to store securely in DB)
         const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = resetTokenExpire;

        await user.save();

        //sendding password recovery in email
        sendPasswordRecoverEmail(user.email , resetToken);
        res.status(200).json({ message: "Password reset email sent" });
        
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.validateResetToken = async (req, res) => {
    try {
        const { key: token } = req.query;
        const { newPassword } = req.body; // New password from the user

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Invalid request" });
        }
        
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Remove reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();

        res.status(200).json({ message: "Valid token" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

