const express = require('express');
let router = express();
const mongoose = require('mongoose');

const { ensureAuthenticated} = require('../helpers/auth');


const Profit = mongoose.model('Profit'); //to store input in db

router.get('/', ensureAuthenticated, (req, res) => res.render('./employee/maxprofit'))

router.post('/',  (req, res) => {
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
    newProfit.save() // save list of items,profit,budget,demands and price
        .then(profit => {
            Profit.findOne({
                _id: profit.id
            }) // fetch from the stored list from database

            let profitPath = []; // to store array possible ways of profit
            let itemSelection = []; // to store array of item to be selected
            let quantitySelection = []; // to store array of qty to be selected
            let answer = [];
            function maxprofit(profit, mybudget, mydemand) {
                const items = profit.items;
                const prof = profit.profit;
                const price = profit.price;
            
                //reduce the demand
                let x = mydemand.reduce((a, b) => a + b);
                if (x > 0) {
                    let quantityArray = [];
                    let budgetArray = [];
                    let profitArray = [];
                    for (let i = 0; i < items.length; i++) {
                        
                        //to find possiblity of the qty
                        quantityArray.push(Math.floor(mybudget / price[i]));
            
                        //if individual qty array is greater then individual demand
                        //and  the qty = demand 
                        if (quantityArray[i] > mydemand[i]) {
                            quantityArray[i] = mydemand[i]
                        }
                        //save this in budget Array by cal
                        // old budget - (quantity Array * price)
                        budgetArray.push(Math.floor(mybudget - (quantityArray[i] * price[i])));
                        //save this in profit Array (quantityArray * profit)
                        profitArray.push(quantityArray[i] * prof[i]);
                    }
                    let maximumProfit = Math.max(...profitArray);//find max from profit array
                    let profitIndex = profitArray.indexOf(maximumProfit); // find index of max proift
                    profitPath.push(profitIndex);// save the possible ways of profit
                    let newBudget = budgetArray[profitIndex]; // get the possible ways of profit
                    quantitySelection.push(quantityArray[profitIndex]); // how many qty of items to buy
                    itemSelection.push(items[profitIndex])// which items to buy
                    quantityArray[profitIndex] = 0;
                    maxprofit(profit, newBudget, quantityArray); //loop the function
            
                } else {
            
                    for (let j = 0; j < profitPath.length; j++) {
                        let value = `{"name" : "${itemSelection[j]}", "qty":"${quantitySelection[j]}"}`
                        answer.push(JSON.parse(value))
                    }
                }
                return answer
            } 
            //pass list of demand proft
            let ans = maxprofit(profit, profit.mybudget, profit.mydemand)
            res.render('./employee/maxprofit', {
                result: ans,

            });
        })
        .catch(err => {        
        req.flash('error_msg','incorrect data')
        res.redirect('/maxprofit')
    });

});




module.exports = router;