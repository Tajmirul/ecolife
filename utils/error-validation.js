const { validationResult } = require('express-validator');

module.exports.errorValidation = (req, isApi = true) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.status = 422;
        error.apiError = isApi;
        throw error;
    }
};

// module.exports.sendErrorMessage = (req, res, redirect = req.headers.referer) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         const error = new Error(errors.array()[0].msg);
//         error.status = 422;
//         error.apiError = true;
//         throw error;
//         // req.flash('error', errors.array()[0].msg);
//         // return res.status(422).redirect(redirect);
//     }
//     return null;
// };
