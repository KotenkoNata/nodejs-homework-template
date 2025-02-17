const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/users-controllers');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');
const {
  validationNewUser,
  validationLoginUser,
  validationSubscription,
} = require('./validation');

router.post('/signup', validationNewUser, ctrl.signup);
router.post('/login', validationLoginUser, ctrl.login);
router.post('/logout', guard, ctrl.logout);
router.get('/current', guard, ctrl.current);
router.patch('/', guard, validationSubscription, ctrl.updateSubscription);
router.patch('/avatars', guard, upload.single('avatar'), ctrl.avatars);

router.get('/verify/:verificationToken', ctrl.verificationToken);
router.post('/verify/', ctrl.repeatEmailVerification);

module.exports = router;
