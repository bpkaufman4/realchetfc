const router = require('express').Router();
const { User } = require('../../models');

router.post('/login', (req, res) => {
    const request = req.body;
    let returnValue = {};
    User.findOne({
        where: {username: request.username}
    })
    .then(reply => {
        if(!reply || !reply.checkPassword(request.pwd)) {
            returnValue.status = 'fail';
            returnValue.message = 'Invalid Login';
            res.json(returnValue);
        } else {
            const user = reply.get({plain: true});
            req.session.userId = user.userId;
            req.session.loggedIn = true;
            req.session.admin = (reply.userType == 'ADMIN');
            returnValue.status = 'success';
            returnValue.target = (reply.userType == 'ADMIN') ? 'admin-players' : '/';
            res.json(returnValue);
        }
    })
});

module.exports = router;