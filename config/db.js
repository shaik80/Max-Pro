const mongoose = require('mongoose');

//connect db 
mongoose.connect(
    '',{ useNewUrlParser: true, useUnifiedTopology: true},  (err) => {
    if (!err) { console.log("db connection sucessed")}
    else { console.log("db connection error " + err)}
})

// require('../models/')