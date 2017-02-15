const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Define our model
const userSchema = new Schema({
  // without lowercase:true a@a.com and A@A.com is different
  email: {type:String,unique:true, lowercase:true},
  password: String
})



// Create the model class
const ModelClass = mongoose.model('user', userSchema)


// Export the model
module.exports = ModelClass
