const Banner = require('../models/bannerModel');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Ad = require('../models/adModel');

module.exports.getIndex = async (req, res, next) => {
    try {
        const ads = await Ad.find();
        const banners = await Banner.find().limit(4);
        const categories = await Category.find();
        const products = await Product.find().populate('category');
        const bestSellingProducts = products.sort((a, b) => b.totalSale - a.totalSale);
        const featuredProducts = products.filter((product) => product.featured).slice(0, 5);
        const newArrivals = products.filter((product) => product.flag.toLowerCase() === 'new').slice(0, 10);

        res.render('layouts/layout', {
            title: 'Home - Ecolife',
            page: 'pages/index',
            path: '/',

            data: {
                banners, categories, bestSellingProducts, ads, featuredProducts, newArrivals,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const categories = await Category.find();
        const product = await Product.findOne({ slug }).populate('category');

        res.render('layouts/layout', {
            title: `${product.title} - ${product.category.name}`,
            page: 'pages/product-details',
            path: '/product',

            data: { categories, product },
        });
    } catch (err) {
        next(err);
    }
};
