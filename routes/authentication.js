const User = require('../models/user');
const config = require('../config/database');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');


module.exports =(router)=>{
 router.get('/',(req,res)=>{
     res.send('Hello world');
 });


router.post('/register',[
    check('firstName').isAlpha().isLength({mn:1}).withMessage('FirstName is required'),
    check('email').isEmail().isLength({min:1}).withMessage('Email is required'),
    check('lastName').isAlpha().withMessage('Last name is required'),
    check('password').isAlphanumeric().withMessage('Password name is required'),
    check('mobilenumber').isNumeric().isLength({min:10}).withMessage('Enter a valid Mobile Number')
],(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()})
    }

    let user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password:req.body.password,
        mobilenumber: req.body.mobilenumber
    });
    user.save((err)=>{
        if(err){
            res.json({success: false,message: 'Unable to save the user Error:', err})
        }else{
            res.json({success: true, message: 'User successfully registered'})
        }
    });
});


router.post('/login', (req, res) => {
    // Check if username was provided
    if (!req.body.email) {
      res.json({ success: false, message: 'No email was provided' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
      } else {
        // Check if username exists in database
        User.findOne({ email: req.body.email}, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({ success: false, message: 'User not found.' }); // Return error
            } else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' }); // Return error
              } else {
                const token = jwt.sign({ user:{
                  userId: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName
                }}, config.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    firstName: user.firstName,
                    userId: user._id,
                    lastName: user.lastName
                  }
                }); // Return success and token to frontend
              }
            }
          }
        });
      }
    }
  });


  // router.use((req, res, next) => {
  //   const token = req.params.authToken||req.body.authToken||req.query.authToken||req.header('authToken');// Create token found in headers
 
 
  //   // Check if token was found in headers
  //   if (!token) {
  //     res.json({ success: false, message: 'No token provided' }); // Return error
  //   } else {
  //     // Verify the token is valid
  //     jwt.verify(token, config.secret, (err, decoded) => {
  //       // Check if error is expired or invalid
  //       if (err) {
  //         res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
  //       } else {
  //         req.decoded = decoded; // Create global variable to use in any request beyond
  //         next(); // Exit middleware
  //       }
  //     });
  //   }
  // });






    
  
 return router;
}