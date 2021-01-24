const express = require('express');
const passport = require('passport');
const { AUTH_STRATEGY } = require('../utils/constant');
const {
  getDevices,
  createDevice,
  updateDevice,
  triggerActionDevice,
  getDataDevice,
  getNewestDataDevice,
  fakeData,
} = require('../controller/device.controller');

const router = express.Router();

router.get('/devices', passport.authenticate(AUTH_STRATEGY, { session: false }), getDevices);

router.post('/devices', passport.authenticate(AUTH_STRATEGY, { session: false }), createDevice);

router.put('/devices/:id', passport.authenticate(AUTH_STRATEGY, { session: false }), updateDevice);

router.post('/devices/:id/trigger', passport.authenticate(AUTH_STRATEGY, { session: false }), triggerActionDevice);

router.get('/devices/:id/data', passport.authenticate(AUTH_STRATEGY, { session: false }), getDataDevice);

router.get('/devices/:id/newest-data', passport.authenticate(AUTH_STRATEGY, { session: false }), getNewestDataDevice);

router.post('/fake_data', fakeData);

module.exports = router;
