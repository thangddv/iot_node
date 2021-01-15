/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  ThangDV
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} data
 * @param   {number} statusCode
 */
const success = (data, message = 'OK', statusCode = 200) => {
  return {
    message,
    error: false,
    code: statusCode,
    data,
  };
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
const error = (message = 'Server Error', statusCode = 500) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code === statusCode);

  const code = findCode || 500;

  return {
    message,
    code,
    error: true,
  };
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
const validation = (errors) => {
  return {
    message: 'Validation errors',
    error: true,
    code: 422,
    errors,
  };
};

module.exports = { success, error, validation };
