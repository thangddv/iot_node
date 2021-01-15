const mogoose = require('mongoose');

const { Schema } = mogoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: {
    type: String,
    default: 'Anonymous',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', async function pre(next) {
  this.username = this.username || 'Anonymous';
  const hash = await bcrypt.hash(this.password, 5);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function comp(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

UserSchema.set('toJSON', { getters: true });
UserSchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};

const User = mogoose.model('user', UserSchema);
module.exports = User;
