const express = require('express');
const passport = require('passport');
const { AUTH_STRATEGY } = require('../utils/constant');
const {
  getDevices,
  createDevice,
  updateDevice,
  triggerActionDevice,
  getDataDevice,
} = require('../controller/device.controller');

const router = express.Router();

router.get(
  '/devices',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  getDevices
);

router.post(
  '/devices',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  createDevice
);

router.merge(
  '/devices',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  updateDevice
);

router.post(
  '/devices/trigger',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  triggerActionDevice
);

router.get(
  '/devices/data',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  getDataDevice
);

module.exports = router;
