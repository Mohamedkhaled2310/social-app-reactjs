const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const { register } = require("./controllers/auth");
const { createPost } = require("./controllers/posts");
const { verifyToken } = require("./middleware/auth");
const {authMiddleware} = require("./middleware/authAdmin");


/* CONFIGURATIONS */
dotenv.config({ path: "./config.env" });
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
mongoose.set('strictQuery', true);


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single('picture'), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use('/admin', adminRoutes);
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3001;
const USER_DB = process.env.USER_DB;

const DB_uri=`mongodb+srv://${USER_DB}@cluster0.3wv2v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(DB_uri)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    console.log("DB Conect");
  })
  .catch((error) => console.log(`${error} did not connect`));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});













