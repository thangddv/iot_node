const express = require('express');
const passport = require('passport');
const { login, register, getUser } = require('../controller/login.controller');
const { AUTH_STRATEGY } = require('../utils/constant');
const { registerValidation, loginValidation } = require('../utils/validate');

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.get(
  '/user',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  getUser
);

module.exports = router;
