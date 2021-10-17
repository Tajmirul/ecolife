const User = require('../models/UserModel');
const Product = require('../models/productModel');
const { errorValidation } = require('../utils/error-validation');
const { throwError } = require('../utils/throwError');

module.exports.postRateProduct = async (req, res, next) => {
    try {
        errorValidation(req, false);

        const { productId, rating, description } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error', 'Product Not found');
            return next();
        }
        try {
            await product.addReview({ userId: req.user._id, rating, description });
            await product.save();
        } catch (err) {
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
        req.user.addToCart(productId, +quantity || 1);
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

module.exports.clearCart = async (req, res, next) => {
    try {
        await req.user.clearCart();
        res.redirect(req.headers.referer);
    } catch (err) {
        next(err);
    }
};

module.exports.postAddToWishList = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            throwError('Product not found', 404, false);
        }
        await req.user.addToWishList(productId);
        return res.redirect(req.headers.referer);
    } catch (err) {
        return next(err);
    }
};

module.exports.postRemoveFromWishList = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            throwError('Product not found', 404, false);
        }
        await req.user.removeFromWishlist(productId);
        res.redirect(req.headers.referer);
    } catch (err) {
        next(err);
    }
};
