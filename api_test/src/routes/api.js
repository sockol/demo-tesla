
const { resolve } = require(`path`);
const Controller = require(resolve(`./src/controllers/index`));

module.exports = app => {
  
  app.get('/api/teslas', Controller.getTeslas)
  app.post('/api/teslas', Controller.teslaInputValidator, Controller.addTesla)
  app.put('/api/teslas/:id', Controller.teslaInputValidator, Controller.updateTesla)
  app.delete('/api/teslas/:id', Controller.removeTesla)
  
  return app;
};
