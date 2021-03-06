const passport = require('passport')
const express = require('express')
const router = express.Router()
const controllers = require('../controllers/position')

router
  .route('/:categoryId')
  .get(
    passport.authenticate('jwt', { session: false }),
    controllers.getByCategoryId
  )
router
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), controllers.create)

router
  .route('/:id')
  .patch(passport.authenticate('jwt', { session: false }), controllers.update)
  .delete(passport.authenticate('jwt', { session: false }), controllers.remove)

module.exports = router
