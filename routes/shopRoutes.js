const express = require('express');
const { body } = require('express-validator');
const {
    getIndex, getProduct, getProductModal, search,
} = require('../controller/shopController');

const router = express.Router();

router.get('/', getIndex);
router.get('/search', search);
router.get('/product/:slug', getProduct);
router.get('/product-modal/:productId', getProductModal);

module.exports = router;
