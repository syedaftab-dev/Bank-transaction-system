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
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Bank Transaction Service is up and running"
    });
});

const path = require('path');

// ? Routes used in the application
app.use('/api', checkDbConnection);
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/users', userRouter);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../../frontend/build');
    app.use(express.static(frontendBuildPath));
    
    app.get('/:path*', (req, res) => {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(404).json({ message: 'API route not found' });
        }
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    app.use((req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });
}


// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
