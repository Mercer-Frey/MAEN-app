const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const userSchema = new Scheme({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

module.exports = mongoose.model('users', userSchema)
