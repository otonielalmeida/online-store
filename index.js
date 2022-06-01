const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

//routes
const homeRoute = require('./routes/home');
const newProductRoute = require('./routes/newPost');
const authRoute = require('./routes/auth');

dotenv.config();
mongoose.connect(process.env.DB_CONNECT, 
    () => console.log('Connected to DB'));

//middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', './views');

//route middlewares
app.use('/', homeRoute);
app.use('/newProduct', newProductRoute );
app.use('/user', authRoute);
app.listen(3000, () => console.log('Server running on http://localhost:3000/'));