const passport = require('passport')
const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const controllers = require('../controllers/category')

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), controllers.getAll)
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.single('image'),
    controllers.create
  )
router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), controllers.getById)
  .delete(passport.authenticate('jwt', { session: false }), controllers.remove)
  .patch(
    passport.authenticate('jwt', { session: false }),
    upload.single('image'),
    controllers.update
  )

module.exports = router
