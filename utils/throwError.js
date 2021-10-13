module.exports.throwError = (message, status = 500, apiError = true) => {
    const error = new Error(message);
    error.status = status;
    error.apiError = apiError;
    throw error;
};
