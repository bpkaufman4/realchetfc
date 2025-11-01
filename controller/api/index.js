const router = require('express').Router();
const playerRoutes = require('./playerRoutes');
const userRoutes = require('./userRoutes');
const matchRoutes = require('./matchRoutes');
const boxScoreRoutes = require('./boxScoreRoutes');
const collegeRoutes = require('./collegeRoutes');
const positionRoutes = require('./positionRoutes');
const matchImageRoutes = require('./matchImageRoutes');
const seasonRoutes = require('./seasonRoutes');
const fantasyRoutes = require('./fantasyRoutes');

router.use('/player', playerRoutes);
router.use('/user', userRoutes);
router.use('/match', matchRoutes);
router.use('/boxScore', boxScoreRoutes);
router.use('/college', collegeRoutes);
router.use('/position', positionRoutes);
router.use('/match-image', matchImageRoutes);
router.use('/season', seasonRoutes);
router.use('/fantasy', fantasyRoutes);

module.exports = router;