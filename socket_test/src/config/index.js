

const express = require(`express`);
const { resolve } = require(`path`);
const { initSecurity, initMiddleware, initRoutes } = require(`./middleware`);

module.exports = async () => {
  let app = express();
  app = initSecurity(app);
  app = initMiddleware(app);
  app = initRoutes(app); 
  return app;
};
