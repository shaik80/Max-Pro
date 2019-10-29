const mongoose =require('mongoose');


const ProfitSchema=new mongoose.Schema({

    itemname:{
        type:String,
        required:true
    },
    profit:{
        type:String,
        required:true
    },
    budget:{
        type:String,
        required:true
    },
    demand:{
        type:String,
        required:true
    }
});
const Profit=mongoose.model('Profit',ProfitSchema);
module.exports=Profit;