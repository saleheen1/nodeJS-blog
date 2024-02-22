require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();
const connectDb = require('./server/config/db')
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
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//routes
app.use('/', require('./server/routes/blogRoutes'));
app.use('/admin', require('./server/routes/adminRoutes'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});