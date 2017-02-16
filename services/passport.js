const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt


// setup options for JWT Strategy
const jwtOptions = {
  // tell jwt where look for token
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),

  // tell jwt which secret to use to decode the token
  secretOrKey: config.secret

}



// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

  // See if the user Id in the payload exists
  // if it does, call 'done' with that user
  // otherwise , call 'done' without a user object
  User.findById(payload.sub, function(err, user){
    // search failed to occur
    if (err) {return done(err, false)}

    // search occured
    if (user) {
      // and a user is found
      done(null, user)
    } else {
      //but could find a user
      done(null, false)
    }
  })
})


// Tell password to use this strategy
passport.use(jwtLogin)

