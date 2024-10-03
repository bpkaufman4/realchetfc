const router = require('express').Router();
const playerRoutes = require('./playerRoutes')

router.use('/player', playerRoutes);

module.exports = router;