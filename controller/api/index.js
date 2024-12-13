const router = require('express').Router();
const playerRoutes = require('./playerRoutes');
const userRoutes = require('./userRoutes');
const matchRoutes = require('./matchRoutes');
const boxScoreRoutes = require('./boxScoreRoutes');

router.use('/player', playerRoutes);
router.use('/user', userRoutes);
router.use('/match', matchRoutes);
router.use('/boxScore', boxScoreRoutes);

module.exports = router;