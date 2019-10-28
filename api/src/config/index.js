

const express = require(`express`);
const { resolve } = require(`path`);
const { seedDb, initSecurity, initMiddleware, initRoutes } = require(`./middleware`);

module.exports = async () => {
  let app = express();
  app = initSecurity(app);
  app = initMiddleware(app);
  app = await seedDb(app);
  app = initRoutes(app);

  return app;
};
