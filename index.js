const express = require('express');
const session = require('express-session');
const { connectDB } = require('./config/db');
const authRoutes = require('./api/routes/authRoutes');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DOMAINE = process.env.HOSTNAME || "localhost";

if (!process.env.MONGODB_URI) {
    console.error("❌ MONGO_URI is not defined in the .env file");
    process.exit(1);
}

console.log(process.env.MONGODB_URI)
// Connect to MongoDB
connectDB();

// Middleware
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

// EJS Setup
app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
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
