const mongoose= require('mongoose');

let wholesaleSchema = new mongoose.Schema({
    ProductName:{
        type:String
    },
    ShopName:{
        type:String
    },
    fixedQty:{
        type:String
    },
    totalpackage:{
        type:String
    },
    CostPrice:{
        type:String
    },
    SellingPrice:{
        type:String
    }
});

mongoose.model('Wholesale',wholesaleSchema)