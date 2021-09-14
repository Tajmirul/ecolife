module.exports.throwError = (message, status, apiError) => {
    const error = new Error(message);
    error.status = status || 500;
    error.apiError = apiError;
    throw error;
};
