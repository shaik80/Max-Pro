const express = require('express');
let router = express();
const mongoose = require('mongoose');
const Wholesale = mongoose.model('Wholesale')
const Demand = mongoose.model('Demand')
const Profit = mongoose.model('Profit');
let profitPath = [];
let itemSelection = [];
let quantitySelection = [];
let answer = [];

router.get('/', async (res, req) => {
    const demands = await Demand.find().sort({
        "demand": -1
    });
    let sortdemandprofit = []
    const demanddata = demands.map((v, k) => {
        return {
            demandproductname: v.ProductName,
            demandvalue: v.demand
        }
    })
    const wholesales = await Wholesale.find();
    wholesales.map((v, k) => {
            return {
                id: v._id,
                productname: v.ProductName,
                Shopname: v.ShopName,
                onepackageprofit: (v.SellingPrice - v.CostPrice),
                CostPrice: v.CostPrice,
                FixedQty: v.fixedQty,
                Totalpackage: v.totalpackage,
            }
        })
        .sort((a, b) => b.onepackageprofit - a.onepackageprofit)
        .forEach((wholesalesvalue, wholesaleskeys) => {
            demanddata.forEach((demandsvalue, demandskeys) => {
                if (wholesalesvalue.productname === demandsvalue.demandproductname) {
                    if (sortdemandprofit[demandskeys] === undefined || sortdemandprofit[demandskeys].Productname !== wholesalesvalue.productname && sortdemandprofit[demandskeys].profit > wholesalesvalue.productname) {
                        let a = JSON.parse(
                            '{"Productname":' + "\"" + wholesalesvalue.productname + "\"" +
                            ',"id":' + "\"" + wholesalesvalue.id + "\"" +
                            ',"Onepackageprofit":' + wholesalesvalue.onepackageprofit +
                            ',"Shop":' + "\"" + wholesalesvalue.Shopname + "\"" +
                            ',"Costprice":' + wholesalesvalue.CostPrice +
                            ',"FixedQty":' + wholesalesvalue.FixedQty +
                            ',"Totalpackages":' + wholesalesvalue.Totalpackage +
                            ',"Demand":' + demandsvalue.demandvalue +
                            '}')
                        sortdemandprofit.push(a) // console.log([...new Set(a)])
                    } else {
                        console.log("error")
                    }
                }
            })
        })
    // console.log(sortdemandprofit)
    // console.log(sortdemandprofit)
    // sortdemandprofit.forEach((v,k) =>{
    //     console.log(v);
    // })



    req.render("./employee/maxprofit", {

    })

})

router.post('/', (req, res) => {

    let arr = req.body.items.split(",");
    let arr1 = req.body.profit.split(",");
    let arr2 = req.body.mydemand.split(",");
    let arr3 = req.body.price.split(",");
    let mybudget = req.body.mybudget;
    const newProfit = new Profit({
        items: arr,
        profit: arr1,
        mybudget,
        mydemand: arr2,
        price: arr3
    });
    newProfit.save()
        .then(profit => {
            Profit.findOne({
                _id: profit.id
            })
            answer = [];
            profitPath = [];
            itemSelection = [];
            quantitySelection = [];
            let ans = maxprofit(profit, profit.mybudget, profit.mydemand)

            console.log("result", ans)
            res.render('./employee/maxprofit', {
                result: ans
            });
        })
        .catch(err => console.log(err));
});

function maxprofit(profit, mybudget, mydemand) {

    const items = profit.items;
    const prof = profit.profit;
    const price = profit.price;

    let x = mydemand.reduce((a, b) => a + b);
    if (x > 0) {
        let quantityArray = [];
        let budgetArray = [];
        let profitArray = [];
        for (let i = 0; i < items.length; i++) {
            quantityArray.push(Math.floor(mybudget / price[i]));
            if (quantityArray[i] > mydemand[i]) {
                quantityArray[i] = mydemand[i]
            }
            budgetArray.push(Math.floor(mybudget - (quantityArray[i] * price[i])));
            profitArray.push(quantityArray[i] * prof[i]);
        }
        let maximumProfit = Math.max(...profitArray);
        let profitIndex = profitArray.indexOf(maximumProfit);
        profitPath.push(profitIndex);
        let newBudget = budgetArray[profitIndex];
        quantitySelection.push(quantityArray[profitIndex]);
        itemSelection.push(items[profitIndex])
        quantityArray[profitIndex] = 0;
        maxprofit(profit, newBudget, quantityArray);

    } else {

        for (let j = 0; j < profitPath.length; j++) {
            answer.push(`number of ${itemSelection[j]} = ${quantitySelection[j]} `)
        }
    }
    return answer
}


module.exports = router;