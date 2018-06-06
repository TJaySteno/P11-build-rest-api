'use strict';

// Custom error constructor
  // Accepts status code, then either an error message or error object
module.exports = (code, error) => {
  let err;
  if (typeof error === 'string') err = new Error(error);
  else err = error;
  err.status = code;
  return err;
}
