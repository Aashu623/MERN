const express = require('express')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middleware/error')
const path = require('path')

// config
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: 'backend/config/config.env' })
}

app.use(cors({
    origin: 'https://mernfrontend-tau.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


// app.use((req, res, next) => {
//     res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
//     next();
// });


//Route Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);


// app.use(express.static(path.join(__dirname, '../frontend/build')))

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
// })

//Middleware for Errors
app.use(errorMiddleware);

module.exports = app;