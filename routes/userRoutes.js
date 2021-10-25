const express = require('express');
const { body } = require('express-validator');
const {
    postAddToCart, postRemoveFromCart, postRateProduct,
    postAddToWishList, clearCart, postRemoveFromWishList,
} = require('../controller/userController');
const { userIsAuth } = require('../middleware/isAuth');

const router = express.Router();

router.post('/rate-product', [
    body('productId').trim().notEmpty().withMessage('Product id not found'),
    body('rating').trim()
        .notEmpty().withMessage('Rating is empty'),
    body('description').trim(),
], userIsAuth, postRateProduct);

router.post('/add-to-cart', [
    body('productId').trim()
        .isEmpty().withMessage('Product id is not provided'),
    body('quantity').trim()
        .isLength({ min: 1 }).withMessage('Minimum quantity is 1'),
], userIsAuth, postAddToCart);

router.post('/remove-from-cart', [
    body('productId').trim()
        .isEmpty().withMessage('Product id is not provided'),
], userIsAuth, postRemoveFromCart);

router.post('/clear-cart', userIsAuth, clearCart);

router.post('/add-to-wishlist', userIsAuth, postAddToWishList);
router.post('/remove-from-wishlist', userIsAuth, postRemoveFromWishList);

module.exports = router;
