const express = require('express');
let router = express();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

router.get('/', (req,res) =>{
    res.render("./layouts/partials/404")
})


module.exports = router;