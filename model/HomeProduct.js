const mongoose = require('mongoose');

const HomeProductSchema = new mongoose.Schema({
    ProductId: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('HomeProduct', HomeProductSchema);
