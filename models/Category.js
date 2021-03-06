const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const categorySchema = new Scheme({
  name: { type: String, required: true },
  imageSrc: { type: String, default: '' },
  user: { ref: 'users', type: Scheme.Types.ObjectId },
})

module.exports = mongoose.model('categories', categorySchema)
