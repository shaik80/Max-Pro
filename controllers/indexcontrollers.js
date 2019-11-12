const express=require('express');
const router =express.Router();
// welcome page
router.get('/',(req,res)=>res.render('welcome'))

//Dashboard
router.get('/dashboard1',(req,res)=>{
    res.render('./employee/dashboard')
});
router.get('/login', (req, res) => res.render('./general/login'));
router.get('/register', (req, res) => res.render('./general/register'));
router.get('/dashboard', (req, res) => res.render('dashboard'));


module.exports=router;