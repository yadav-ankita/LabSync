require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const connectDb = require("./db/connect");

const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

const AuthRoute=require("./routes/AuthRoute")
const StudentRoute = require("./routes/studentRoutes");
const AdminFacultyRoute=require("./routes/AdminFacultyRoute");
//const FacultyRoute=require("./routes/FacultyRoute");
const AdminRoute=require("./routes/AdminRoute");

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));

app.set("trust proxy", 1);

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("LabSync Backend Running...");
});

app.use("/api/v1/auth",AuthRoute);
app.use("/api/v1/student", StudentRoute);
app.use("/api/v1/admin/faculty",AdminFacultyRoute);
//app.use("/api/v1/faculty",FacultyRoute);
app.use("/api/v1/admin",AdminRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);

//const PORT = process.env.PORT || 5000;
const PORT=4000;
const url='mongodb://localhost:27017/LabSyncDB'
const start = async () => {
    try {
       // await connectDb(process.env.MONGO_URI);
          await connectDb(url);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log(error);
    }
};

start();