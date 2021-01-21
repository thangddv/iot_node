const mogoose = require('mongoose');

const { Schema } = mogoose;

const DataSchema = new Schema({
  deviceId: {
    type: Number,
    required: true,
  },
  mac: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
  },
  data: {
    type: String,
  },
});

DataSchema.set('toJSON', { getters: true });
DataSchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  return obj;
};

const Data = mogoose.model('data', DataSchema);
module.exports = Data;
