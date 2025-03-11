const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DOMAINE = process.env.SERVER || "localhost";

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/auth', authRoutes);

// EJS Setup
app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
});

app.listen(PORT, () => {
    console.log(`Server running on http://${DOMAINE}:${PORT}`);
});
