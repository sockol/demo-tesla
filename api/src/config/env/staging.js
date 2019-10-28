
const config = require(`./staging.js`);
const uuid = require(`uuid/v4`);

// dont seed on prod ever
module.exports = {
  ...config,
};
