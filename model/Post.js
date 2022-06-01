const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    uploadDate: {
        type: Date,
        default: () => Date.now()
    }

})

module.exports = mongoose.model('Post', PostSchema);
