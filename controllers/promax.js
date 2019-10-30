const express = require('express');
let router = express();
const mongoose = require('mongoose');


router.get('/', (res,req) =>{
    req.render('./employee/maxprofit')
})


module.exports = router;