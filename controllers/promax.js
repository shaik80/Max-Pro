const express = require('express');
let router = express();
const mongoose = require('mongoose');
const Wholesale = mongoose.model('Wholesale')
const Demand = mongoose.model('Demand')


router.get('/', async (res,req) =>{
    const demands = await Demand.find().sort({"demand" : -1});
    let sortdemandprofit = []
    const demanddata = demands.map((v,k) =>{
        return {
            demandproductname:v.ProductName,
            demandvalue:v.demand
        }
    })
    const wholesales = await Wholesale.find();
    wholesales.map((v,k) =>{
        return {
            id:v._id, 
            productname:v.ProductName, 
            Shopname:v.ShopName,
            onepackageprofit:(v.SellingPrice - v.CostPrice),
            FixedQty:v.fixedQty,
            Totalpackage: v.totalpackage,
        }
    })
    .sort((a,b) => b.onepackageprofit - a.onepackageprofit)
    .forEach((wholesalesvalue,wholesaleskeys) => {
        demanddata.forEach((demandsvalue,demandskeys) =>{
            if(wholesalesvalue.productname === demandsvalue.demandproductname){
                if(sortdemandprofit[demandskeys] === undefined ||sortdemandprofit[demandskeys].Productname !== wholesalesvalue.productname && sortdemandprofit[demandskeys].profit > wholesalesvalue.productname )
                {
                    let a = JSON.parse(
                                       '{"Productname":'+ "\""+wholesalesvalue.productname+ "\""+
                                       ',"id":'+ "\""+wholesalesvalue.id+"\""+
                                       ',"Onepackageprofit":'+ wholesalesvalue.onepackageprofit+
                                       ',"Shop":'+ "\""+wholesalesvalue.Shopname+"\"" +
                                       ',"FixedQty":' + wholesalesvalue.FixedQty +
                                       ',"Totalpackages":' + wholesalesvalue.Totalpackage +
                                       ',"Demand":' + demandsvalue.demandvalue +
                                       '}')
                    sortdemandprofit.push(a)// console.log([...new Set(a)])
                }
                else{
                    console.log("error")
                }
            }
    })
    })
    console.log(sortdemandprofit)
    // console.log(sortdemandprofit)
    // sortdemandprofit.forEach((v,k) =>{
    //     console.log(v);
    // })


    
        res.render("employee/list")
})

module.exports = router;