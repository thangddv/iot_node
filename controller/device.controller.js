const { validationResult } = require('express-validator');
const { success, error, validation } = require('../utils/response');
const Device = require('../model/device');
const Data = require('../model/data');

const { DEVICE_STATUS, DEVICE_MAX } = require('../utils/constant');
const { triggerDevice } = require('../mqtt/publish');
const { receiveData } = require('../mqtt/subcribe');

const getDevices = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    const userId = req.user.id;
    const status = req.query.status || [DEVICE_STATUS.ACTIVE, DEVICE_STATUS.INACTIVE, DEVICE_STATUS.RUNNING];
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
    const { id } = req.params;
    const { mac, deviceName, deviceId, deviceType, status } = req.body;
    const device = await Device.findById(id);
    if (!device) return res.status(422).json(error('Device is not found', res.statusCode));

    if (mac) device.mac = mac;
    if (deviceName) device.deviceName = deviceName;
    if (deviceId) device.deviceId = deviceId;
    if (deviceType) device.deviceType = deviceType;
    if (status) device.status = status;
    device.save();

    return res.status(200).json(success(device));
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
    const deviceId = req.params.id;
    const device = await Device.findById(deviceId);
    if (!device) return res.status(422).json(error('Device is not found', res.statusCode));

    const date = new Date();
    date.setDate(date.getDate() - 1);
    const data = await Data.find({ mac: device.mac, deviceId: device.deviceId, timestamp: { $gt: date.getTime() } });
    if (!data || data.length === 0) return res.status(422).json(error('Device does not have data', res.statusCode));

    return res.status(200).json(success({ device, result: data }));
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
    const { deviceId } = req.params.id;
    const device = await Device.findById(deviceId);
    if (!device) return res.status(422).json(error('Device is not found', res.statusCode));

    if (device.status === DEVICE_STATUS.RUNNING) {
      triggerDevice(device, DEVICE_STATUS.ACTIVE);
    }

    if (device.status === DEVICE_STATUS.ACTIVE) {
      triggerDevice(device, DEVICE_STATUS.RUNNING);
    }

    return res.status(200).json(success(`Changed status device to ${device.status}`));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
};

const fakeData = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    let count = 0;
    const devices = await Device.aggregate([{ $sample: { size: 5 } }]);
    const callback = () => {
      devices.forEach((item) => {
        receiveData('/data', { ...item, timestamp: new Date().getTime(), data: Math.random() * 100 });
      });
      count += 1;
      if (count > 10) clearInterval(0);
    };
    setInterval(callback, 10000);
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
  fakeData,
};
