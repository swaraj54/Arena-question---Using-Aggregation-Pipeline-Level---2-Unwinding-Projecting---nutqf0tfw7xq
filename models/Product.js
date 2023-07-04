/* Product Model */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    metrics: {
        totalWishlists: {
            type: Number,
            required: true,
            default: 0
        },
        totalQuantitySold: {
            type: Number,
            required: true,
            default: 0
        },
        totalReviews: {
            type: Number,
            required: true,
            default: 0
        },
        avgRating: {
            type: Number,
            required: true,
            default: 0
        }
    },
});

/*
{
      "name": "S690pro",
      "price": 199.99,
      "tags": ["smart", "connected", "wireless", "sleek", "user-friendly"],
      "metrics": {
        "totalWishlists": 120,
        "totalQuantitySold": 750,
        "totalReviews": 25,
        "avgRating": 4.6
      }
    },
*/

const Product = mongoose.model('Product', productSchema);

module.exports = Product;