const mqtt = require('mqtt');
const config = require('../config');

const mqttClient = {};

mqttClient.connectMQTT = () => {
  mqttClient.client = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`);
};

mqttClient.onSubcribe = (topic, callback) => {
  mqttClient.client.on('connect', () => {
    mqttClient.client.subscribe(topic);
  });

  mqttClient.client.on('message', (_topic, message) => {
    console.log('Recv: ', _topic, message.toString());
    if (topic === _topic) callback(_topic, message);
  });
};

mqttClient.onPublish = (topic, message) => {
  console.log('Sended: ', topic, message);
  mqttClient.client.publish(topic, message);
};

module.exports = mqttClient;
