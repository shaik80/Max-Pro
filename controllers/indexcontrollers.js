const express=require('express');
const router =express.Router();
// welcome page
router.get('/',(req,res)=>res.render('welcome'))

//Dashboard
router.get('/dashboard',(req,res)=>res.render('./employee/dashboard'));

module.exports=router;