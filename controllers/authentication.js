const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}

exports.signin = function(req, res, next){
  // user has laready had thier email and password auth'd
  // we just need to give them a token

  res.send({token: tokenForUser(req.user)})
}
exports.signup = function(req, res, next){

  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422).send({error:'you must proivde email and password!'})
  }
  // see if a user with the given email exists

  //TODO : what's next(err) do?
  User.findOne( {email:email}, function(err, existingUser){
      // if a user with email does exist, return an error
    if (err) {
      return next(err)
    }

    if ( existingUser) {
      return res.status(422).send({error:'Email is in use'})
    }


    // if a user with emai does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })

    user.save(function(err){
      if(err) {return next(err)}
    // Respond to request indicating the user was created
    // need to send a token back to user identified they are authenticated
      res.json({token: tokenForUser(user)})
    })

  })

}
