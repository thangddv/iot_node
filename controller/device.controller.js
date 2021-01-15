const { validationResult } = require('express-validator');
const { success, error, validation } = require('../utils/response');
const Device = require('../model/device');
const config = require('../config');
const { DEVICE_STATUS, DEVICE_MAX, DEVICE_TYPE } = require('../utils/constant');

const getDevices = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    const userId = req.user.id;
    const status = req.query.status || ['active', 'inactive'];
    const type = req.query.type || ['Board', 'Sensor', 'Device'];

    const devices = await Device.find({
      userId,
      status: { $in: status },
      deviceType: { $in: type },
    });
    return res.status(200).json(success(devices));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
};

const createDevice = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    const userId = req.user.id;
    const { mac, deviceName, deviceId, deviceType, status } = req.body;
    const count = await Device.find({
      userId,
      mac,
      status: DEVICE_STATUS.ACTIVE,
    }).countDocuments();
    if (count > DEVICE_MAX) return res.status(422).json(error('Number of device is maximun', res.statusCode));

    const device = await Device.find({
      userId,
      mac,
      deviceId,
      status: DEVICE_STATUS.ACTIVE,
    });
    if (device && device.length > 0) return res.status(422).json(error('Device is connected', res.statusCode));

    const newDevice = await Device.create({
      userId,
      mac,
      deviceName,
      deviceId,
      deviceType,
      status,
    });
    return res.status(200).json(success(newDevice));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
};

const updateDevice = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    return res.status(200).json(success());
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
};

const getDataDevice = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    return res.status(200).json(success());
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
};

const triggerActionDevice = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    return res.status(200).json(success());
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
};

module.exports = {
  getDevices,
  createDevice,
  updateDevice,
  triggerActionDevice,
  getDataDevice,
};
