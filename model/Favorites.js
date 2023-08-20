const mongoose = require('mongoose');

const FavoritesSchema = new mongoose.Schema({
    ProductId: {
        type: String,
        required: true
    },
    User: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Favorites', FavoritesSchema);
