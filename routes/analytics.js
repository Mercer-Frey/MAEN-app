const express = require('express')
const passport = require('passport')
const router = express.Router()
const controllers = require('../controllers/analytics')

router
  .route('/analytics')
  .get(passport.authenticate('jwt', { session: false }), controllers.analytics)
router
  .route('/overview')
  .get(passport.authenticate('jwt', { session: false }), controllers.overview)

module.exports = router
