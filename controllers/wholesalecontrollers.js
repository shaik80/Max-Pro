const express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const Wholesale = mongoose.model('Wholesale')





router.get('/wholesale', (req,res) =>{
    res.render('./wholesale/addoredit',{
        wholesale: req.body
    })
})

router.post('/wholesale',(req,res) =>{
    InsertRecord(req,res)
})

function InsertRecord(req,res){
    let wholesale =new Wholesale()
    wholesale.ProductName = req.body.ProductName;
    wholesale.ShopName = req.body.ShopName;
    wholesale.fixedQty = req.body.fixedQty;
    wholesale.totalpackage = req.body.totalpackage;
    wholesale.CostPrice = req.body.CostPrice;
    wholesale.SellingPrice = req.body.SellingPrice;
    wholesale.save((err,doc) => {
        if(!err){
            res.redirect('/wholesale');
        }
        else{
            if(err.name == 'ValidationError'){
                handleerror(err,req.body)     
            }
            else
            {
                console.log("error during insertion"+err)
            }
        }
    })
}


router.get('/wholesales', async (req,res)=>{
    try{
        const wholesale = await Wholesale.find();
        res.send(wholesale)
    }
    catch(err){
        res.json(err)
    }
});






module.exports = router; 