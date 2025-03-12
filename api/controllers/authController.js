const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, sexe, tel, family_status, CIN, doti } = req.body;

        const fName = first_name.toUpperCase();
        const LName = last_name.toUpperCase();
        const Emaill = email.toUpperCase();
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
        const user = new User({
            first_name: fName,
            last_name: LName,
            cin: CIN,
            sexe: sexe,
            email: Emaill, // Ensure stored email is uppercase
            password: hashedPassword,
            tel: tel,
            doti: doti,
            family_statut: family_status,
            role: Role
        });

        await user.save();
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
                return res.status(400).json({ message: "Invalid CIN or Email", success: false });
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        req.session.user = user;

        return res.status(200).json({ token, success: true });
    } catch (err) {
        return res.status(500).json({ error: err.message, success: false });
    }
};
