const express=require('express');
const router =express.Router();
const bcrypt=require('bcryptjs');
const passport =require('passport');
//User model
const User =require('../models/User');

//profit model
const Profit =require('../models/Profit');

//Login page
router.get('/login',(req,res)=>res.render('login'));

//Register page
router.get('/register',(req,res)=>res.render('register'));

//dashboard page
router.get('/dashboard',(req,res)=>res.render('dashboard'));




//Register Handle
router.post('/register',(req,res)=>{
    const{name,email,password,password2}=req.body;
    let errors=[];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'});
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
    }
    else{
        // validation passed
        User.findOne({email:email})
        .then(user=>{
            if(user){
                //user exists
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
        });

    }else {
         const newUser= new User({
             name,
             email,
             password
         });
        //Hash password
        bcrypt.genSalt(10,(err,salt)=>
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            //set password to hash
            newUser.password=hash;
            //save user
            newUser.save()
            .then(user=>{
                req.flash('success_msg','You are now registered and can log in')
                res.redirect('/users/login');
            })
            .catch(err=>console.log(err));
        }))
    }
    
});

}
});   

// login handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect:'/users/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
})(req,res,next);
});

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/users/login');
    
})

//dashboard
router.post('/dashboard',(req,res)=>{
    const{items,profit,mybudget,mydemand,price}=req.body;
    let arr = items.split(",");
    let arr1=profit.split(",");
    let arr2=mydemand.split(",");
    let arr3=price.split(",");
    const newProfit= new Profit({
     items:arr,
     profit:arr1,
     mybudget,
     mydemand:arr2,
     price:arr3
 });
 newProfit.save()
 .then(profit=>{
     
     res.redirect('/users/dashboard');
   
 Profit.findOne({_id:profit.id})
 .then(profit=>{
    let profitPath = [];
    let itemSelection = [];
    let quantitySelection = [];
    let answer = [];

    function maxprofit(profit,mybudget,mydemand){
        const items=profit.items;
        const prof=profit.profit;
        const price=profit.price;
        let x=mydemand.reduce((a,b)=>a+b);
        if(x>0){
            let quantityArray=[];
            let budgetArray=[];
            let profitArray = [];
            for(let i=0;i<items.length;i++){
                quantityArray.push(Math.floor(mybudget/price[i]));
                    if(quantityArray[i]>mydemand[i]){
                        quantityArray[i]=mydemand[i]
                    }  
                budgetArray.push(Math.floor(mybudget-(quantityArray[i]*price[i])));
                profitArray.push(quantityArray[i]*prof[i]);
            }
            let maximumProfit = Math.max(...profitArray);
            let profitIndex = profitArray.indexOf(maximumProfit);
            profitPath.push(profitIndex);
            let newBudget=budgetArray[profitIndex];
            quantitySelection.push(quantityArray[profitIndex]);
            itemSelection.push(items[profitIndex])
            quantityArray[profitIndex] = 0;
            maxprofit(profit,newBudget,quantityArray);
           
        }
        else{
            for(let j=0;j<profitPath.length;j++){
                answer.push(`number of ${itemSelection[j]} = ${quantitySelection[j]} `)
            }          
        }
        return answer
    } 
    
let ans=maxprofit(profit,profit.mybudget,profit.mydemand);
console.log(ans);
})
.catch(err => console.log(err));

 });
 
});

module.exports=router;

