const router = require('express').Router();
const { Season } = require('../../models');

router.get('/:id', (req, res) => {
  Season.findOne({ where: { seasonId: req.params.id } })
    .then(dbData => {
      if (dbData) {
        const cleanData = dbData.get({ plain: true });
        res.json(cleanData);
      } else {
        res.json({ status: 'fail', message: 'no season found' });
      }
    })
    .catch(err => {
      console.error(err);
      res.json({ status: 'fail', message: err.message });
    })
})
router.post('/create', (req, res) => {

  if (!req.session.admin) {
    res.json({ status: 'fail', message: 'must be admin' });
    return;
  }

  let request = req.body;
  Season.create(request)
    .then(reply => {
      res.json({ status: 'success', reply });
    })
    .catch(err => {
      res.json({ status: 'fail', err });
    })
});

router.patch('/:id', (req, res) => {
  if (!req.session.admin) {
    res.json({ status: 'fail', message: 'must be admin' });
    return;
  }

  let request = req.body;

  Season.update(request, { where: { seasonId: req.params.id } })
    .then(reply => {
      res.json({ status: 'success', reply });
    })
    .catch(err => {
      res.json({ status: 'fail', err });
    })
});

router.delete('/:id', (req, res) => {
  if (!req.session.admin) {
    res.json({ status: 'fail', message: 'must be admin' });
    return;
  }

  Season.destroy({ where: { seasonId: req.params.id } })
    .then(reply => {
      res.json({ status: 'success', reply });
    })
    .catch(err => {
      res.json({ status: 'fail', err });
    })
})

module.exports = router;