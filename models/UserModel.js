const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,

    isActive: { type: Boolean, default: true },
    isSuperAdmin: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isGuest: { type: Boolean, default: false },

    resetToken: String,
    resetTokenExpire: Date,

    cart: {
        total: { type: Number, default: 0 },
        item: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        }],
    },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
