const router = require('express').Router();
const playerRoutes = require('./playerRoutes');
const userRoutes = require('./userRoutes');
const matchRoutes = require('./matchRoutes');
const boxScoreRoutes = require('./boxScoreRoutes');
const collegeRoutes = require('./collegeRoutes');
const positionRoutes = require('./positionRoutes');

router.use('/player', playerRoutes);
router.use('/user', userRoutes);
router.use('/match', matchRoutes);
router.use('/boxScore', boxScoreRoutes);
router.use('/college', collegeRoutes);
router.use('/position', positionRoutes);

module.exports = router;