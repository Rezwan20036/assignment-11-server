require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/firebase-config');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['https://infra-report.netlify.app', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const issueRoutes = require('./routes/issueRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/issues', issueRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/stats', statsRoutes);

app.get('/', (req, res) => {
    res.send('Public Infrastructure Issue Reporting System API is running');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
