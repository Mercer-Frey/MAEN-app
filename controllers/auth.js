const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

const User = require('../models/User')

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email })
  if (!candidate) {
    res.status(404).json({
      message: 'Email or password are invalid',
    })
  }
  const passwordResult = bcrypt.compareSync(
    req.body.password,
    candidate.password
  )
  if (!passwordResult) {
    res.status(404).json({
      message: 'Email or password are invalid',
    })
  }
  const token = jwt.sign(
    {
      email: candidate.email,
      userId: candidate._id,
    },
    keys.jwt,
    { expiresIn: 3600 }
  )
  res.status(200).json({ token: `Bearer ${token}` })
}

module.exports.signUp = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email })
  if (candidate) {
    res.status(409).json({
      message: 'user is existed',
    })
    return
  }

  const salt = bcrypt.genSaltSync(10)
  const password = req.body.password

  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(password, salt),
  })
  try {
    await user.save()
    res.status(201).json(user)
  } catch (error) {
    errorHandler(res, error)
  }
}
