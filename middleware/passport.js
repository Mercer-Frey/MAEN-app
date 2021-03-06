const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const keys = require('../config/keys')
const User = require('../models/User')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt,
}

module.exports = passport =>
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ _id: jwt_payload.userId }).select(
          'email id'
        )
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      } catch (error) {
        console.log(error)
      }
    })
  )
