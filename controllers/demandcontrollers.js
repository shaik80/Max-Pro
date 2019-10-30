const express = require('express');
let router = express();
const mongoose = require('mongoose');
const Demand = mongoose.model('Demand')

router.get('/demand', (req,res) =>{
    res.render("./demand/addoredit",{
            demand: req.body
        })
})

router.post('/demand', (req,res) =>{
    InsertRecord(req,res)
})

function InsertRecord(req,res){
    let demand =new Demand()
    demand.ProductName = req.body.ProductName;
    demand.demand = req.body.demand;
    demand.save((err,doc) => {
        if(!err){
            res.redirect('/demand');
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

router.get('/demands', async (req,res)=>{
    try{
        const demand = await Demand.find().sort({"demand" : -1}).limit(10);
        res.send(demand)
    }
    catch(err){
        res.json(err)
    }
});

module.exports = router;