
// this file will be imported frmo node as well. no babel on backend is set up so need to require
const slugify = require(`slugify`);
const jwt = require(`jsonwebtoken`);

const isServer = () => typeof window === `undefined`;

module.exports = {
  isServer,
};

