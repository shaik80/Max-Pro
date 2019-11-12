const express = require('express');
let router = express();



router.get('/', (res, req) => {
    req.render('./employee/index')
})


module.exports = router;