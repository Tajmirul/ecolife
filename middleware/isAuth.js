// check if the uses is already logged in
// if user is not authorized redirect login page

module.exports.isAuth = (req, res, next) => {
    if (!req.session?.user) {
        return res.redirect(`/${process.env.ADMIN_PANEL_PATH}/auth/signin`);
    }

    return next();
};
