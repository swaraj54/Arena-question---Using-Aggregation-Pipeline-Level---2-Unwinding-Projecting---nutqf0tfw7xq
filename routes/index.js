const router = require('express').Router();

router.use('/products', require('./productRoutes'));

module.exports = router;
