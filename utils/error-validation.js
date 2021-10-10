const { validationResult } = require('express-validator');

module.exports.errorValidation = (req) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.status = 422;
        error.apiError = true;
        throw error;
    }
};

module.exports.sendErrorMessage = (req, res, redirect) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        res.status(422).redirect(redirect);
    }
};
