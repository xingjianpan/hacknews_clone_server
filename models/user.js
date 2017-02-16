const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcrypt-nodejs')

// Define our model
const userSchema = new Schema({
  // without lowercase:true a@a.com and A@A.com is different
  email: {type:String,unique:true, lowercase:true},
  password: String
})

// On Save Hook, encypt password
// Before saving a model, run this function
userSchema.pre('save', function(next){
  //get access to the user model
  // user is an instance of userModel
  const user = this //user.email, user.password

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt){
    if(err) { return next(err)}

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) {return next(err)}

      // overwrite plain text password with encrypter password
      user.password = hash
      next()
    })
  })
})
// Create the model class
const ModelClass = mongoose.model('user', userSchema)


// Export the model
module.exports = ModelClass
