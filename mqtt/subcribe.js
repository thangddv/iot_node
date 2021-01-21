const Data = require('../model/data');

const receiveData = (_topic, _payload) => {
  try {
    const payload = JSON.parse(_payload.toString());
    const { mac, data } = payload;
    const timestamp = new Date().getTime();
    const results = [];
    const dev_5 = { deviceId: 5, mac, timestamp, data: {} };
    const dev_6 = { deviceId: 6, mac, timestamp, data: {} };
    const dev_7 = { deviceId: 7, mac, timestamp, data: {} };
    const dev_8 = { deviceId: 8, mac, timestamp, data: {} };
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(data)) {
      if (key[1] === '5' && value !== 'nan') {
        dev_5.data[key] = value;
      }
      if (key[1] === '6' && value !== 'nan') {
        dev_6.data[key] = value;
      }
      if (key[1] === '7' && value !== 'nan') {
        dev_7.data[key] = value;
      }
      if (key[1] === '8' && value !== 'nan') {
        dev_8.data[key] = value;
      }
    }
    if (dev_5.data && (dev_5.data.H5 || dev_5.data.T5)) {
      results.push(dev_5);
    }
    if (dev_6.data && (dev_6.data.H6 || dev_6.data.T6)) {
      results.push(dev_6);
    }
    if (dev_7.data && (dev_7.data.H7 || dev_7.data.T7)) {
      results.push(dev_7);
    }
    if (dev_8.data && (dev_8.data.H8 || dev_8.data.T8)) {
      results.push(dev_8);
    }
    Data.collection.insertMany(results);
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { receiveData };
