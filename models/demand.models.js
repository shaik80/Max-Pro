const mongoose = require('mongoose');

let demandSchema = new mongoose.Schema({
    ProductName: {
        type: String
    },
    demand: {
        type: Number
    }
});

mongoose.model('Demand', demandSchema)