const router = require('express').Router();
const playerRoutes = require('./playerRoutes');
const userRoutes = require('./userRoutes');

router.use('/player', playerRoutes);
router.use('/user', userRoutes);

module.exports = router;