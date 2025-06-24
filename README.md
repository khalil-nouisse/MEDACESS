# 🏥 MEDACESS - Medical Health Record Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.14+-green.svg)](https://www.mongodb.com/)

**MEDACESS** is a comprehensive medical health record platform for managing patient data and healthcare information. Built with Node.js, Express, and MongoDB.

## ✨ Features

- 🔐 **Secure Authentication** - User registration, login, and role-based access
- 👥 **User Management** - Patient and doctor profiles with role separation
- 📋 **Medical Records** - Treatment tracking, medical notes, and history
- 🏥 **Healthcare Dashboard** - Separate interfaces for patients and providers
- 📱 **Responsive Design** - Mobile-friendly modern UI

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: EJS, HTML5/CSS3, JavaScript
- **Security**: bcrypt, JWT, express-session
- **Email**: Nodemailer for notifications

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/medacess.git
   cd medacess
   npm install
   ```

2. **Environment Setup**
   Create `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/medacess
   SESSION_SECRET=your_secret_here
   PORT=5000
   ```

3. **Run Application**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5000`

## 📁 Structure

```
medacess/
├── api/          # Routes, controllers, models, services
├── config/       # Database configuration
├── public/       # Static assets
├── views/        # EJS templates
└── index.js      # Main application
```

## 🎯 Usage

- **Patients**: Register, view medical history, update profiles
- **Doctors**: Access patient records, manage treatments, add notes

## 🔒 Security

- Password hashing with bcrypt
- Session management with MongoDB store
- Input validation and CORS protection

---

**Made with ❤️ for better healthcare management**
