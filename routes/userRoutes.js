const express = require('express');
const { getIndex, getProduct } = require('../controller/userController');

const router = express.Router();

router.get('/', getIndex);
router.get('/product/:slug', getProduct);

module.exports = router;
