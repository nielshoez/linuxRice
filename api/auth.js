const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const secret = process.env.TOKEN

router.post('/register',(req,res)=>{
    const {name,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }

    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length > 0 ) {
        res.send({
        errors : errors,
        name : name,
        email : email,
        password : password,
        password2 : password2})
    } else {
        //validation passed
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user);   
            if(user) {
                errors.push({msg: 'email already registered'});
                res.status(500).send({errors,name,email,password,password2})
            } else {
                var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
                User.create({
                  name : req.body.name,
                  email : req.body.email,
                  password : hashedPassword
                },
                function (err, user) {
                  if (err) return res.status(500).send("There was a problem registering the user.")
                  // create a token
                  var token = jwt.sign({ id: user._id }, secret, {
                    expiresIn: 86400 // expires in 24 hours
                  });
                  res.status(200).send({ auth: true, token: token });
                });
            }
        })
    }
})

router.get('/me', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
        User.findById(decoded.id, 
            { password: 0 }, // projection
            function (err, user) {
                if (err) return res.status(500).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("No user found.");
                res.status(200).send(user);
        });
  });
});

router.post('/login', function(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      
      var token = jwt.sign({ id: user._id }, secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      
      res.status(200).send({ auth: true, token: token });
    });
    
  });

module.exports  = router;