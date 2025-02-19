const router = require('express').Router();
const playerRoutes = require('./playerRoutes');
const userRoutes = require('./userRoutes');
const matchRoutes = require('./matchRoutes');
const boxScoreRoutes = require('./boxScoreRoutes');
const collegeRoutes = require('./collegeRoutes');
const positionRoutes = require('./positionRoutes');
const matchImageRoutes = require('./matchImageRoutes');

router.use('/player', playerRoutes);
router.use('/user', userRoutes);
router.use('/match', matchRoutes);
router.use('/boxScore', boxScoreRoutes);
router.use('/college', collegeRoutes);
router.use('/position', positionRoutes);
router.use('/match-image', matchImageRoutes);

module.exports = router;