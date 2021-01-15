const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { success, error, validation } = require('../utils/response');
const User = require('../model/user');
const config = require('../config');

const register = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) return res.status(400).json(error('Email is existed', res.statusCode));

    await User.create({ username, email, password });

    // Sign token
    const newUser = await User.findOne({ email });
    const token = jwt.sign({ id: newUser.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });
    const userResponse = { ...newUser.toJSON(), ...{ token } };
    return res.status(200).json(success(userResponse, 'Register new user successfully'));
  } catch (e) {
    return res.status(500).json(error());
  }
};

const login = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.email) return res.status(400).json(error('Email is not correct!', res.statusCode));

    const isPasswordMatched = await user.isValidPassword(password);
    if (!isPasswordMatched) return res.status(400).json(error('Password is not correct!', res.statusCode));

    // Sign token
    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });
    const userToReturn = { ...user.toJSON(), ...{ token } };
    return res.status(200).json(userToReturn);
  } catch (e) {
    return res.status(500).json(error(e));
  }
};

const getUser = async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json(validation(errorsAfterValidation.mapped()));
  }
  try {
    return res.status(200).json(success(req.user));
  } catch (e) {
    return res.status(500).json(error(e.message));
  }
};

module.exports = { login, register, getUser };
