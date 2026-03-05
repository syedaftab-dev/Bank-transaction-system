const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());


// ? Routes required
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.route');

// test api
app.get("/",(req,res)=>{
    res.send("Backend Service is up and running")
})

// ? Routes used in the application
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);


module.exports = app;
