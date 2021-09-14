const express = require('express');
const { body } = require('express-validator');
const {
    getIndex,
    getActivities,
    getCategories,
    getBanners,
    getAddBanner,
    postAddBanner,
    deleteBanner,
    getProducts,
    getAddProduct,
    postAddProduct,
    getAddCategory,
    postAddCategory,
    getCategoryLabel,
    getEditCategory,
    postEditCategory,
    deleteCategory,
} = require('../controller/adminController');
// const User = require('../models/UserModel');

const router = express.Router();

router.get('/', getIndex);
router.get('/activities', getActivities);

// manage banner information
router.get('/banner', getBanners);
router.get('/banner/add', getAddBanner);
router.post('/banner/add', [
    body('heading').trim()
        .not().isEmpty()
        .withMessage('Banner heading can\'t be empty')
        .isLength({ max: 100 })
        .withMessage('Max length of heading is 100'),
    body('text').trim()
        .not().isEmpty()
        .withMessage('Banner text is required')
        .isLength({ max: 50 })
        .withMessage('Max length of text is 50'),
    body('productCategory').trim()
        .not().isEmpty()
        .withMessage('Select a category'),
    body('image').not().custom((value, { req }) => {
        if (!req.file) {
            return true;
        }
        return false;
    }).withMessage('Select an background image(.png, .jpg, .jpeg and .webp)'),
], postAddBanner);
router.delete('/banner/delete', deleteBanner);

// manage product
router.get('/product', getProducts);
router.get('/product/add', getAddProduct);
router.post('/product/add', [
    body('title').trim()
        .not().isEmpty()
        .withMessage('Product title can\'t be empty')
        .isLength({ max: 100 })
        .withMessage('Max length of title is 100'),
    body('price').trim()
        .not().isEmpty()
        .withMessage('Price can\'t be empty')
        .isNumeric()
        .withMessage('Price should be a number')
        .custom((value) => {
            if (value < 100) {
                return Promise.reject(new Error('Price should be greater than 50'));
            }
            return true;
        }),
    body('discount').trim()
        .custom((value) => {
            if (Number.isNaN(+value)) {
                return Promise.reject(new Error('Discount should be a number'));
            }
            return true;
        }),
    body('category')
        .not().isEmpty().withMessage('Category can\'t be empty'),
    body('tags')
        .not().isEmpty().withMessage('Please select at least one tag'),
    body('flag')
        .notEmpty().withMessage('Flag should not be empty'),
    body('shortDescription')
        .notEmpty().withMessage('Short description should not be empty'),
    body('description')
        .notEmpty().withMessage('Description should not be empty'),
    body('image').custom((value, { req }) => {
        if (!req.file) {
            return Promise.reject(new Error('Image should not be empty'));
        }
        if (req.file.size > 2000000) {
            return Promise.reject(new Error('Image is too large'));
        }
        return true;
    }),
], postAddProduct);

// manage categories
router.get('/category', getCategories);

router.post('/category-label', [
    body('label').trim().custom((value) => {
        const expectedLabel = ['main', 'sub', 'pro-sub'];
        if (!expectedLabel.includes(value)) {
            return Promise.reject(new Error('Label is not supported'));
        }
        return true;
    }),
], getCategoryLabel);

router.get('/category/add', getAddCategory);
router.post('/category/add', [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('label').trim()
        .custom((value) => {
            if (!value) {
                return null;
            }
            const expectedLabel = ['main', 'sub', 'pro-sub'];
            if (!expectedLabel.includes(value)) {
                return Promise.reject(new Error('Label is not supported'));
            }
            return true;
        }),
    body('parent').trim().custom((value, { req }) => {
        if (!value && req.body.label !== 'main') {
            return Promise.reject(new Error('Please select a parent category'));
        }
        return true;
    }),
], postAddCategory);
router.delete('/category/delete', deleteCategory);

router.get('/category/edit', getEditCategory);
router.post('/category/edit', [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('label').trim()
        .custom((value) => {
            if (!value) {
                return null;
            }
            const expectedLabel = ['main', 'sub', 'pro-sub'];
            if (!expectedLabel.includes(value)) {
                return Promise.reject(new Error('Label is not supported'));
            }
            return true;
        }),
    body('parent').trim().custom((value, { req }) => {
        if (!value && req.body.label !== 'main') {
            return Promise.reject(new Error('Please select a parent category'));
        }
        return true;
    }),
], postEditCategory);

module.exports = router;
