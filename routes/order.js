const passport = require('passport')
const express = require('express')
const router = express.Router()
const controllers = require('../controllers/order')

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), controllers.getAll)
  .post(passport.authenticate('jwt', { session: false }), controllers.create)

module.exports = router
