const express = require('express');
const { body } = require('express-validator');
const {
    postAddToCart, postRemoveFromCart, postRateProduct,
    postAddToWishList, clearCart, postRemoveFromWishList,
} = require('../controller/userController');

const router = express.Router();

router.post('/rate-product', [
    body('productId').trim().notEmpty().withMessage('Product id not found'),
    body('rating').trim()
        .notEmpty().withMessage('Rating is empty'),
    body('description').trim(),
], postRateProduct);

router.post('/add-to-cart', [
    body('productId').trim()
        .isEmpty().withMessage('Product id is not provided'),
    body('quantity').trim()
        .isLength({ min: 1 }).withMessage('Minimum quantity is 1'),
], postAddToCart);

router.post('/remove-from-cart', [
    body('productId').trim()
        .isEmpty().withMessage('Product id is not provided'),
], postRemoveFromCart);

router.post('/clear-cart', clearCart);

router.post('/add-to-wishlist', postAddToWishList);
router.post('/remove-from-wishlist', postRemoveFromWishList);

module.exports = router;
