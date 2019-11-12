const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = mongoose.model('User');
require('../config/passport')(passport)

const { ensureAuthenticated} = require('../helpers/auth');

// welcome page
router.get('/', (req, res) => res.render('welcome'))
//Dashboard
router.get('/dashboard',  ensureAuthenticated,(res, req) => req.render('./employee/index'))


router.get('/login', (req, res) => res.render('./general/login'));
router.get('/register', (req, res) => res.render('./general/register'));
router.get('/dashboard', (req, res) => res.render('./general/dashboard'));
router.get('/404', (req, res) => res.render('./general/404'));

// Register form post
router.post('/register', (req,res) =>{
    let errors = [];
    if(req.body.password != req.body.confirmpassword){
        errors.push({text:'Password do not match'})
    }
    if(req.body.password.length < 6){
        errors.push({text:'Password must be at least 6 characters'})
    }
    if(errors.length > 0){
        res.render('./general/register',{
            errors : errors,
            fullname: req.body.fullname,
            emailid: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword
        });
    }
    else{
        User.findOne({emailid: req.body.email})
        .then(user => {
            if(user){
                req.flash('error_msg','Emai already registered')
                res.redirect('/login')
            }else{
                const newuser = new User({
                    fullname: req.body.fullname,
                    emailid: req.body.emailid,
                    password: req.body.password
                })
                // console.log(newuser);
                bcrypt.genSalt(10, (err, salt) =>{
                    bcrypt.hash(newuser.password, salt, (err,hash)=>{
                        if(err) throw err;
                        newuser.password = hash
                        newuser.save()
                            .then(user => {
                                req.flash('success_msg','You are now register now login')
                                res.redirect('/login')
                            })
                            .catch(err =>{
                                console.log(err);
                                return;
                            });
                    })
                })

            }
        })

        
    }
})

// login handle
router.post('/login',(req,res,next) => {
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);
})


//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;