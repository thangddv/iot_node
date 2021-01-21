const mogoose = require('mongoose');
const { DEVICE_STATUS } = require('../utils/constant');

const { Schema } = mogoose;

const DeviceSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  mac: {
    type: String,
  },
  deviceId: {
    type: Number,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    enum: ['Board', 'Sensor', 'Device'],
    required: true,
  },
  status: {
    type: String,
    enum: [DEVICE_STATUS.ACTIVE, DEVICE_STATUS.INACTIVE, DEVICE_STATUS.RUNNING],
  },
});

DeviceSchema.set('toJSON', { getters: true });
DeviceSchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  return obj;
};

const Device = mogoose.model('device', DeviceSchema);
module.exports = Device;
