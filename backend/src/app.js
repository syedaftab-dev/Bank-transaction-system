const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/error.middleware');
const morgan = require('morgan');

// Trigger Redis connection
require('./config/redis');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// ? Routes required
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.route');
const userRouter = require('./routes/user.routes');
const checkDbConnection = require('./middleware/db.middleware');

// test api
const path = require('path');

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../../frontend/build');
    app.use(express.static(frontendBuildPath));
    
    // Serve frontend for all non-API routes
    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
}

// ? Routes used in the application
app.use('/api', checkDbConnection);
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/users', userRouter);

// Test API route (only accessible if not served by frontend)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Bank Transaction Service is up and running"
    });
});

// Handle undefined routes (only in development or for missing API routes)
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
