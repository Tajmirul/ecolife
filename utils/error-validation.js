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
