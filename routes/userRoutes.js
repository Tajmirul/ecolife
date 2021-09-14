const express = require('express');
const { getIndex } = require('../controller/userController');

const router = express.Router();

router.get('/', getIndex);

module.exports = router;
