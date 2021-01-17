const mqttClient = require('./index');

const triggerDevice = (device, action) => {
  const topic = `/${device.mac}/${device.deviceId}`;
  const message = { action };
  mqttClient.onPublish(topic, message);
  device.save();
};

module.exports = { triggerDevice };
