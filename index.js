const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
const authRoutes  = require('./api/routes/authRoutes');
const userRoutes  = require('./api/routes/userRoutes');
const MongoStore = require('connect-mongo');
const router = express.Router();
const { treatmentsDisplay } = require('./api/services/patientServices');
const path = require("path");
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DOMAINE = process.env.SERVER || "localhost";

if (!process.env.MONGODB_URI) {
    console.error("❌ MONGO_URI is not defined in the .env file");
    process.exit(1);
}

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: { secure: process.env.NODE_ENV === "production" }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// EJS Setup
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, './public')));

// Home Route 
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
});

app.get('/khalil', async (req, res) => {
    try {
        const response = await treatmentsDisplay(req, res);
        console.log(response);
        //res.render('khalil', { user: req.session.user || null, data: response });
    } catch (error) {
        console.error("Error fetching user history:", error);
    }
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user || null });
});

app.get('/dash', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }    
    res.render('dashboard', { user: req.session.user });
});

app.get('/update', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('update', { user: req.session.user || null });
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user || null });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://${DOMAINE}:${PORT}`);
});
