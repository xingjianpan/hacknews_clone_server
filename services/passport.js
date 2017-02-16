const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// Create local strategy
const localOptions = {
  usernameField:'email'
}

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // Veriry this email and password, call done with the user
  // if it's corret usernaem and passowrd
  // otherwise, call done with false

  //search for user
  User.findOne({email:email}, function(err, user){
    // error in search
    if(err) { return done(err)}

    // search success, no user found
    if (!user) { return done(null, false)}

    // compare pasword - is 'password' equal to user.password?

    user.comparePassword(password, function(err, isMatch){
      if (err) {return done(err)}

      if (!isMatch) {return done(null, false)}

      return done(null, user)
    })

  })

})

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
passport.use(localLogin)
