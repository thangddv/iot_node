const Data = require('../model/data');

const receiveData = (_topic, _data) => {
  try {
    const { deviceId, mac, timestamp, data } = _data;
    Data.create({ deviceId, mac, timestamp, data });
    console.log('Sended: ', data);
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { receiveData };
