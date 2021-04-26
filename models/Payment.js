const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    },
    productPrice: {
        type: Number,
        min: 0,
    }

}, { timestamps: true })


module.exports = mongoose.model('Payment', paymentSchema);
