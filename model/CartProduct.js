const mongoose = require('mongoose');

const CartProductSchema = new mongoose.Schema({
    ProductId: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        default: 1
    },
    User: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('CartProduct', CartProductSchema);
