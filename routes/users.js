const express=require('express');
const router =express.Router();


//Login page
router.get('/login',(req,res)=>res.render('login'));

//Register page
router.get('/register',(req,res)=>res.render('register'));


//Register Handle
router.post('/register',(req,res)=>{
    const{name,email,password,password2}=req.body;
    let errors=[];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'Passwords do not match'});
    }

    //check password length
    if(password.length<6){
        errors.push({msg:'Password should be atleast 6 characters'});
    }
    //check passwords match
    if(password!==password2){
        errors.push({msg:'Passwords do not match'});
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        // validation passed
    }
    
});


module.exports=router;