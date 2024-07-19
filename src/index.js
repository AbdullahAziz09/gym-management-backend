const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
const trainerRouter = require('./routes/trainerRouter');
const traineeRouter = require('./routes/traineeRouter'); 
const packageRoute = require('./routes/packageRoute');
const paymentRouter = require('./routes/paymentRouter')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = 'mongodb://127.0.0.1:27017/gym-management';

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use('/api/auth', authRouter);
    app.use('/api/admins', adminRouter);
    app.use('/api/trainers', trainerRouter);
    app.use('/api/trainees', traineeRouter); 
    app.use('/api/packages', packageRoute);
    app.use('/api/payments', paymentRouter)

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

startServer();
