const mongoose =require('mongoose');


const ProfitSchema=new mongoose.Schema({

    items:{
        type:[String],
        required:true
    },
    profit:{
        type:[Number],
        required:true
    },
    mybudget:{
        type:Number,
        required:true
    },
    mydemand:{
        type:[Number],
        required:true
    },
    price:{
        type:[Number],
        required:true
    }
});
mongoose.model('Profit',ProfitSchema);
