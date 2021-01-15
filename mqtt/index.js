const mqtt = require('mqtt');

// const client = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`);

// client.on('connect', () => {
//   client.subscribe('/temperature');
//   client.subscribe('presence', (err) => {
//     if (!err) {
//       client.publish('presence', 'Hello mqtt');
//     }
//   });
// });

function handle() {
  const client = mqtt.Client();
  client.on('message', (topic, message) => {
    console.log(message.toString());
  });
}

module.exports = handle;
