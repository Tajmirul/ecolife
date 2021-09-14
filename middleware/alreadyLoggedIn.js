// if user is authorized do not let him to go sign in or sign up page

module.exports.alreadyLoggedIn = (req, res, next) => {
    if (req.session?.user) {
        return res.redirect(`/${process.env.ADMIN_PANEL_PATH}`);
    }
    return next();
};
