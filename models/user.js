const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const userSchema = new Schema({
    firstName:{type: String, required: true, unique: false},
    email:{ type: String, required: true, unique: true},
    lastName: { type: String, required: true, unique: false},
    password: { type: String, required: true, unique: false},
    mobilenumber:{type: Number, required: true, unique: true}
     
});
    userSchema.pre('save', function(next) {
        // Ensure password is new or modified before applying encryption
        if (!this.isModified('password'))
          return next();
      
        // Apply encryption
        bcrypt.hash(this.password, null, null, (err, hash) => {
          if (err) return next(err); // Ensure no errors
          this.password = hash; // Apply encryption to password
          next(); // Exit middleware
        });
      });
    
      userSchema.methods.comparePassword = function(password) {
        return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
      };
      


module.exports = mongoose.model('User', userSchema);