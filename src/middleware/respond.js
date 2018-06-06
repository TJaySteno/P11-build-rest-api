// Custom response constructor
  // Accepts status code, res object, and (optional) location route
module.exports = (code, res, route) => {
  res.status(code);
  if (route) res.location(route);
}
