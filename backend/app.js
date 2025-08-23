const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error");
const path = require("path");

// config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const allowedOrigins = [
  "https://mernfrontend-tau.vercel.app",
  "https://www.brahmiacademy.com",
  "https://www.brahmiacademy.com/",
  "https://brahmiacademy.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: false,
  abortOnLimit: true,
  responseOnLimit: 'File size limit has been reached',
}));

// app.use((req, res, next) => {
//     res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
//     next();
// });

//Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// app.use(express.static(path.join(__dirname, '../frontend/build')))

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
// })

//Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
