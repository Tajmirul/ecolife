const fs = require('fs');
const { errorValidation } = require('../utils/error-validation');
const { makeSlug } = require('../utils/makeSlug');
const { throwError } = require('../utils/throwError');
const { checkFileExt } = require('../utils/checkFileExt');
// models
const Banner = require('../models/bannerModel');
const Product = require('../models/productModel');
const User = require('../models/UserModel');
const Category = require('../models/categoryModel');
const Ad = require('../models/adModel');

const { productImageResize } = require('../utils/imageResize');
const { deleteFile } = require('../utils/file');

module.exports.getIndex = async (req, res, next) => {
    try {
        const adminRequest = await User
            .find({ isAdmin: true, isActive: false })
            .sort({ createdAt: -1 });

        res.render('admin/layouts/layout', {
            title: 'Admin Panel - Ecolife',
            page: 'pages/index',
            path: `/${process.env.ADMIN_PANEL_PATH}`,
            user: req.user,

            data: { adminRequest },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getActivities = (req, res) => {
    res.render('admin/layouts/layout', {
        title: 'Activities - Ecolife',
        page: 'pages/activities',
        path: `/${process.env.ADMIN_PANEL_PATH}/activities`,
        user: req.user,

        data: {},
    });
};

module.exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();

        res.render('admin/layouts/layout', {
            title: 'All Category - Ecolife',
            page: 'pages/categories',
            path: `/${process.env.ADMIN_PANEL_PATH}/category`,
            user: req.user,

            data: { categories },
        });
    } catch (err) {
        return next(err);
    }
    return null;
};

module.exports.getCategoryLabel = async (req, res, next) => {
    try {
        const { label } = req.body;
        let parentCategory = '';

        if (label === 'sub') {
            parentCategory = 'main';
        } else if (label === 'pro-sub') {
            parentCategory = 'sub';
        }

        const categories = await Category.find({ label: parentCategory });
        res.status(200).json({ message: 'Category found', categories });
    } catch (err) {
        next(err);
    }
};

module.exports.getAddCategory = async (req, res, next) => {
    try {
        const categories = await Category.find();

        return res.render('admin/layouts/layout', {
            title: 'Add Category - Ecolife',
            page: 'pages/edit-category',
            path: `/${process.env.ADMIN_PANEL_PATH}/category/add`,
            user: req.user,

            data: { categories },
        });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.postAddCategory = async (req, res, next) => {
    try {
        errorValidation(req);

        const { name, label, parent } = req.body;
        const slug = makeSlug(name);

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            throwError('Category already exists', 422, true);
        }

        const category = new Category({
            name,
            slug,
            label: label || 'main',
            parent,
        });

        try {
            await category.save();
        } catch (err) {
            throwError('Unable to save', 500, true);
        }

        res.json({ message: 'Category Saved' });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.getEditCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.query;
        let category; let parent;

        try {
            category = await Category.findOne({ _id: categoryId }).populate('parent');
            parent = category.parent;
        } catch (err) {
            category = await Category.findOne({ _id: categoryId });
            parent = null;
        }

        const parents = await Category.find({ label: parent?.label });

        return res.render('admin/layouts/layout', {
            title: 'Add Category - Ecolife',
            page: 'pages/edit-category',
            path: `/${process.env.ADMIN_PANEL_PATH}/category/edit`,
            user: req.user,

            data: {
                category,
                parents,
                editMode: true,
            },
        });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.postEditCategory = async (req, res, next) => {
    try {
        errorValidation(req);

        const {
            categoryId, name, label, parent,
        } = req.body;
        const slug = makeSlug(name);

        const categoryExists = await Category.findOneAndUpdate(
            { _id: categoryId },
            {
                name, slug, label, parent,
            },
            { useFindAndModify: false },
        );

        try {
            await categoryExists.save();
        } catch (err) {
            throwError('Unable to save', 500, true);
        }

        res.json({ message: 'Category Saved' });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.deleteCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.body;

        try {
            await Category.findOneAndDelete({ _id: categoryId });
        } catch (err) {
            throwError('Unable to delete category', 500, true);
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports.getBanners = async (req, res) => {
    const banners = await Banner.find();

    res.render('admin/layouts/layout', {
        title: 'Banners - Ecolife',
        page: 'pages/banners',
        path: `/${process.env.ADMIN_PANEL_PATH}/banner`,
        user: req.user,

        data: { banners },
    });
};

module.exports.getAddBanner = (req, res) => {
    res.render('admin/layouts/layout', {
        title: 'Add Banner - Ecolife',
        page: 'pages/edit-banner',
        path: `/${process.env.ADMIN_PANEL_PATH}/banner/add`,
        user: req.user,

        data: { editMode: false },
    });
};

module.exports.postAddBanner = async (req, res, next) => {
    try {
        errorValidation(req);
        const { heading, text, productCategory } = req.body;

        // check if banner is already exists
        const bannerExists = await Banner.findOne({ heading });
        if (bannerExists) {
            throwError('Banner is already exists', 422, true);
        }

        // add new banner
        const banner = new Banner({
            slug: makeSlug(heading),
            image: req.file.path.replace(/\\/g, '/'),
            heading,
            text,
            productCategory,
        });

        try {
            await banner.save();
        } catch (err) {
            throwError('Unable to save banner', 500, true);
        }
        return res.status(200).json({ message: 'Success! Banner information has been added.' });
    } catch (err) {
        next(err);
    }
    return null;
};
module.exports.deleteBanner = async (req, res, next) => {
    try {
        const { _id } = req.body;

        try {
            await Banner.deleteOne({ _id });
        } catch (err) {
            const error = new Error('Unable to delete banner');
            error.status = 500;
            error.apiError = true;
            throw error;
        }

        return res.status(200).json({ message: 'Banner Deleted.' });
    } catch (err) {
        next(next);
    }
    return null;
};

// manage products
module.exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.render('admin/layouts/layout', {
            title: 'All Products - Ecolife',
            page: 'pages/products',
            path: `/${process.env.ADMIN_PANEL_PATH}/product`,
            user: req.user,

            data: { products },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAddProduct = async (req, res) => {
    res.render('admin/layouts/layout', {
        title: 'Add New Product - Ecolife',
        page: 'pages/edit-product',
        path: `/${process.env.ADMIN_PANEL_PATH}/product/add`,
        user: req.user,

        data: { editMode: false },
    });
};

module.exports.postAddProduct = async (req, res, next) => {
    try {
        errorValidation(req);
        if (req.file) {
            checkFileExt(req.file.originalname, 'image');
        }

        const {
            title, price, discount, category, shortDescription, description,
        } = req.body;
        const tags = JSON.parse(req.body.tags);
        const flag = JSON.parse(req.body.flag);

        // resize image 800x800 => 100x100, 360x360, 630x630
        // oneSet = {thumb, normal, large, extraLarge}
        const oneSet = await productImageResize(req.file.path);

        // check if product already exists
        const existingProduct = await Product.findOne({ slug: makeSlug(title) });
        if (existingProduct) {
            throwError('Product already exists', 422, true);
        }

        // create new product
        const product = new Product({
            slug: makeSlug(title),
            title,
            price,
            discount,
            category,
            tags,
            flag,
            shortDescription,
            description,
            images: [oneSet],
        });
        try {
            product.save();
        } catch (err) {
            throwError('Unable to save product', 500, true);
        }
        res.status(200).json({ message: 'Product successfully added' });
    } catch (err) {
        next(err);
    }
};

module.exports.getAds = async (req, res, next) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 });

        res.render('admin/layouts/layout', {
            title: 'All Products - Ecolife',
            page: 'pages/ads',
            path: `/${process.env.ADMIN_PANEL_PATH}/ad`,
            user: req.user,

            data: { ads },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAddAd = async (req, res, next) => {
    try {
        errorValidation(req);
        const categories = await Category.find();

        res.render('admin/layouts/layout', {
            title: 'Add New Advertisement - Ecolife',
            page: 'pages/edit-ad',
            path: `/${process.env.ADMIN_PANEL_PATH}/ad/add`,
            user: req.user,

            data: {
                editMode: false,
                categories,
            },
        });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.postAddAd = async (req, res, next) => {
    try {
        errorValidation(req);

        const { slug, imageSize } = req.body;
        const image = req.file.path.replace(/\\/g, '/');

        const ad = new Ad({ slug, imageSize, image });
        try {
            await ad.save();
        } catch (err) {
            throwError('Unable to save', 500, true);
        }

        return res.json({ message: 'Advertisement Saved' });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.getEditAd = async (req, res, next) => {
    try {
        errorValidation(req);
        const { adId } = req.query;
        const categories = await Category.find();
        const ad = await Ad.findById(adId);

        res.render('admin/layouts/layout', {
            title: 'Add New Advertisement - Ecolife',
            page: 'pages/edit-ad',
            path: `/${process.env.ADMIN_PANEL_PATH}/ad/edit`,
            user: req.user,

            data: {
                editMode: true,
                categories,
                ad,
            },
        });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.postEditAd = async (req, res, next) => {
    try {
        errorValidation(req);

        const { adId, slug, imageSize } = req.body;
        const image = req.file?.path?.replace(/\\/g, '/');

        const ad = await Ad.findById(adId);
        const oldImage = ad.image;

        if (adId) ad.slug = slug;
        if (imageSize) ad.imageSize = imageSize;
        if (image) ad.image = image;

        try {
            await ad.save();
        } catch (err) {
            throwError('Unable to save', 500, true);
        }
        if (image) deleteFile(oldImage);

        return res.json({ message: 'Advertisement Saved' });
    } catch (err) {
        next(err);
    }
    return null;
};

module.exports.deleteAd = async (req, res, next) => {
    try {
        const { adId } = req.body;
        const ad = await Ad.findById(adId);
        try {
            await Ad.deleteOne({ _id: adId });
        } catch (err) {
            throwError('Unable to delete ad', 500, true);
        }
        deleteFile(ad.image);

        res.status(204).json({ message: 'Advertisement Deleted' });
    } catch (err) {
        next(err);
    }
};
