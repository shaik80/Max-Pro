const mongoose =require('mongoose');


const ProfitSchema=new mongoose.Schema({

    itemname:{
        type:[],
        required:true
    },
    profit:{
        type:[],
        required:true
    },
    budget:{
        type:[],
        required:true
    },
    demand:{
        type:[],
        required:true
    }
});
const Profit=mongoose.model('Profit',ProfitSchema);
module.exports=Profit;