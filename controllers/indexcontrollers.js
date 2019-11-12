const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const User = mongoose.model('User');
const Profit = mongoose.model('Profit');



// welcome page
router.get('/', (req, res) => res.render('welcome'))

//Dashboard
router.get('/dashboard1', (req, res) => {
    res.render('./employee/dashboard')
});
router.get('/login', (req, res) => res.render('./general/login'));
router.get('/register', (req, res) => res.render('./general/register'));
router.get('/dashboard', (req, res) => res.render('./general/dashboard'));
router.get('/404', (req, res) => res.render('./general/404'));

//Register Handle
router.post('/register', (req, res) => {
    console.log(req.body)
    const name = name.req.body,
        email = email.req.body,
        password = password.req.body,
        password2 = password2.req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all fields'
        });
    }

    //check password length
    if (password.length < 6) {
        errors.push({
            msg: 'Password should be atleast 6 characters'
        });
    }
    //check passwords match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation passed
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    //user exists
                    errors.push({
                        msg: 'Email is already registered'
                    });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });

                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }

            });

    }
});

// login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');

})


module.exports = router;