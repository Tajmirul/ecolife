const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    // userId: ,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    images: [{
        thumb: String,
        normal: { type: String, required: true },
        large: { type: String, required: true },
        extraLarge: String,
    }],
    price: { type: Number, required: true },
    discount: Number,
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String, required: true }],
    flag: [{ type: String, required: true }],
    rating: { type: Number, required: true, default: 0 },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: { type: Number, required: true },
        description: { type: String, required: true },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
