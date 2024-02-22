require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();
const connectDb = require('./server/config/db')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const PORT = 3000 || process.env.PORT;

//connect db
connectDb();

//need this middleware to get data from input fields
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//make this folder accessible to browser
app.use(express.static('public'));

//Template engine
app.use(expressLayout);
//default page layout
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//For login
app.use(cookieParser());

//Need to ovveride method to use PUT and DELETE from form
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));


//routes
app.use('/', require('./server/routes/blogRoutes'));
app.use('/admin', require('./server/routes/adminRoutes'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});