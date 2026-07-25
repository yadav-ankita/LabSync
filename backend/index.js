//security packages
require('dotenv').config();
const cors = require('cors')
const rateLimiter = require('express-rate-limit');
const express = require('express');
const app = express();


const connectDb = require('./db/connect');


//Middlewares
const notFound = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/errorHandler')
const authenticationMiddleware = require('./middleware/authUser')


//Routers
const AuthRoute = require('./routes/user');
const StudentRoute=require('./routes/student');


app.use(cors({
  origin: [
    'http://localhost:5173',
  ],
  credentials: true
}))
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.urlencoded({ extended: false }));
//app.use("/uploads", express.static("uploads"));
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Your book store App")
})

app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/student',StudentRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
const url = 'mongodb://localhost:27017/LabSync'
//const url = process.env.MONGO_URI;
const start = async () => {
  try {
    await connectDb(url)
    app.listen(port, () => {
      console.log(`app is listeing on port ${port}`)
    })
  } catch (error) {
    console.log("error in app.js", error)
  }
}
start()