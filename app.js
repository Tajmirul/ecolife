const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const adminAuthRouter = require('./routes/adminAuthRouter');
const { get404, getError } = require('./controller/errorController');
const { isAuth } = require('./middleware/isAuth');
const User = require('./models/UserModel');

const app = express();

// configuring variables of .env file
dotenv.config();
app.set('view engine', 'ejs');

// * begin::accepting file from request

// define storage path
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
    const fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    const fileExts = ['.png', '.jpg', '.jpeg', '.webp'];

    if (fileTypes.includes(file.mimetype) && fileExts.includes(path.extname(file.originalname))) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const store = new MongoDBStore({
    uri: process.env.MONGO_STRING,
    collection: 'sessions',
});
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
// * end::accepting file from request
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // session is valid for 1 week
}));

app.use(async (req, res, next) => {
    try {
        const sessionUser = req.session.user;
        const user = await User.findOne({ _id: sessionUser?._id });

        if (!user) {
            return next();
        }

        req.user = user;
        req.isLoggedIn = true;
        return next();
    } catch (err) {
        next(err);
    }
    return null;
});

// enable request body
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(userRouter);
app.use(`/${process.env.ADMIN_PANEL_PATH}/auth`, adminAuthRouter);
app.use(`/${process.env.ADMIN_PANEL_PATH}`, isAuth, adminRouter);

// route for 404 page
app.use(get404);

// server error
app.use(getError);

// connect to database
mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Listening at port ${process.env.PORT || 8080}`);
        // listening for incoming request
        app.listen(process.env.PORT || 8080);
    })
    .catch(() => {
        // console.log(err);
        console.log('There is some error running this app. :(');
    });
