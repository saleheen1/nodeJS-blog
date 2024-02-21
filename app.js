require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');


const connectDb = require('./server/config/db')
//connect db
connectDb();

const PORT = 3000 || process.env.PORT;

app.use(express.static('public'));

//Template engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//blog route
app.use('/', require('./server/routes/blogRoutes'));

// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`)
// });