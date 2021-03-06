const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const ordersSchema = new Scheme({
  date: { type: Date, default: Date.now },
  order: { type: Number, required: true },
  list: [
    {
      name: { type: String },
      quantity: { type: Number },
      cost: { type: Number },
    },
  ],
  user: { ref: 'users', type: Scheme.Types.ObjectId },
})

module.exports = mongoose.model('orders', ordersSchema)
