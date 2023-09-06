// cors.js
module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your React app's URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  };
  