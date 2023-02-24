const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'data'
  },
  products: [
    {
      product: {
        type: String,
        ref: 'products'
      }
    }
  ]
})

const wishlist=mongoose.model('Wishlist', wishlistSchema)

module.exports = wishlist