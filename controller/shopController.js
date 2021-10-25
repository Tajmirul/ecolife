const { performance } = require('perf_hooks');
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

module.exports.search = async (req, res, next) => {
    try {
        const { q, price } = req.query;
        console.log(req.query);
        if (!q?.trim().length) {
            return res.redirect('/');
        }

        const categories = await Category.find();

        const agg = [
            {
                $search: {
                    compound: {
                        should: [
                            {
                                text: {
                                    query: q,
                                    path: 'title',
                                    score: {
                                        boost: {
                                            value: 5,
                                        },
                                    },
                                    fuzzy: {},
                                },
                            }, {
                                text: {
                                    query: q,
                                    path: ['shortDescription', 'description'],
                                    fuzzy: {},
                                },
                            },
                        ],
                    },
                },
            }, {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
        ];
        const t0 = performance.now();
        const products = await Product.aggregate(agg);
        const t1 = performance.now();
        const deference = (t1 - t0).toFixed(2);
        const searchSpeed = `${products.length} product found in ${deference} ms`;

        let foundAllCategories = products.map((product) => product.category[0]);
        foundAllCategories = foundAllCategories.filter(
            (item, index, self) => index === self.findIndex(
                (t) => (t._id.toString() === item._id.toString()),
            ),
        );

        return res.render('layouts/layout', {
            title: `Searching for '${q}' - Ecolife`,
            page: 'pages/search',
            path: '/search',

            data: {
                q,
                price,
                products,
                categories,
                foundAllCategories,
                searchSpeed,
            },
        });
    } catch (err) {
        return next(err);
    }
};

module.exports.getProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const categories = await Category.find();
        const product = await Product.findOne({ slug }).populate('category').populate('reviews.userId');

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

module.exports.getProductModal = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        res.render('components/modals/productModal', {
            data: { product },
        });
    } catch (err) {
        next(err);
    }
};
