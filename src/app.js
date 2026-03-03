const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

// ? Routes required
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');

// ? Routes used in the application
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);


module.exports = app;
