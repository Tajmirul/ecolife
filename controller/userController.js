const Banner = require('../models/bannerModel');
const Category = require('../models/categoryModel');

module.exports.getIndex = async (req, res, next) => {
    const banners = await Banner.find().limit(4);
    const categories = await Category.find();

    try {
        res.render('layouts/layout', {
            title: 'Home - Ecolife',
            page: 'pages/index',
            path: '/',

            data: { banners, categories },
        });
    } catch (err) {
        next(err);
    }
};
