const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const csrf = require('csurf');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const userAuthRouter = require('./routes/userAuthRouter');
const adminAuthRouter = require('./routes/adminAuthRouter');
const User = require('./models/UserModel');
const { get404, getError } = require('./controller/errorController');
const { isAuth } = require('./middleware/isAuth');

const csrfProtection = csrf({ cookie: true });
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

const app = express();

// configuring variables of .env file
dotenv.config();
app.set('view engine', 'ejs');
// enable request body
app.use(cookieParser());
// to parse url encoded payload (form)
app.use(express.urlencoded({ extended: true }));
// to parse json payload
app.use(express.json());
app.use(csrfProtection);
// activating flash message
app.use(flash());
// activating session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // session is valid for 1 week
}));
app.use('/public', express.static(path.join(__dirname, 'public')));

// * accepting file from request
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// * get user from session
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

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.message = req.flash();
    res.locals._csrf = req.csrfToken();
    next();
});

app.use(userRouter);
app.use(userAuthRouter);
app.use(`/${process.env.ADMIN_PANEL_PATH}/auth`, adminAuthRouter);
app.use(`/${process.env.ADMIN_PANEL_PATH}`, isAuth, adminRouter);

// route for 404 page
app.use(get404);

// server error
app.use(getError);

// connect to database
mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Listening at http://localhost:${process.env.PORT || 8080}`);
        // listening for incoming request
        app.listen(process.env.PORT || 8080);
    })
    .catch(() => {
        // console.log(err);
        console.log('There is some error running this app. :(');
    });
