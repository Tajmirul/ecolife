const Product = require('../models/productModel');
const { errorValidation } = require('../utils/error-validation');

module.exports.postRateProduct = async (req, res, next) => {
    try {
        errorValidation(req, false);

        const { productId, rating, description } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error', 'Product Not found');
            return next();
        }
        product.reviews = [{ userId: req.user._id, rating, description }, ...product.reviews];
        try {
            await product.save();
        } catch (err) {
            console.log(err);
            req.flash('error', 'Unable to save review');
        }

        return res.redirect(req.headers.referer);
    } catch (err) {
        return next(err);
    }
};

module.exports.postAddToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if (!req.user) {
            return res.redirect('/signin');
        }
        req.user.addToCart(productId, +quantity);
        return res.status(200).redirect(req.headers.referer);
    } catch (err) {
        return next(err);
    }
};

module.exports.postRemoveFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;

        if (!req.user) {
            return res.redirect('/signin');
        }
        req.user.removeFromCart(productId);
        return res.redirect(req.headers.referer);
    } catch (err) {
        return next(err);
    }
};

module.exports.getCartItems = async (req, res, next) => {
    try {
        console.log('cart items');
    } catch (err) {
        next(err);
    }
};
