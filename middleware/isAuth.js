const User = require('../models/UserModel');

// check if the uses is already logged in
// if user is not authorized redirect login page

module.exports.isAuth = (req, res, next) => {
    if (!req.session?.user) {
        return res.redirect(`/${process.env.ADMIN_PANEL_PATH}/auth/signin`);
    }

    const user = User.findOne(req.session?.user._id);
    // user must be super admin or admin and active
    if (!(user && (user.isSuperAdmin || user.isAdmin) && user.isActive)) {
        return res.status(401).redirect('/signin');
    }

    return next();
};
