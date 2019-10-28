
const bodyParser = require(`body-parser`);
const compression = require(`compression`);
const methodOverride = require(`method-override`);
const cookieParser = require(`cookie-parser`);
const helmet = require(`helmet`);
const chalk = require(`chalk`);
const flash = require(`connect-flash`);
const { resolve } = require(`path`);
const glob = require(`glob`);
const fs = require(`fs`);
const cors = require(`cors`);

const redisClient = require(resolve(`./src/lib/Redis`));
const SEED_DATA = require(resolve(`./src/config/env`)).seed

const corsConfig = {
  origin: (origin, callback) => {
    const whitelist = (process.env.CORS_WHITELIST || ``).split(`,`).map(i => i.trim());

    // NOTE: fix later
    // no origin when making backend call. kind of makes this redundant
    if (!origin)
      return callback(null, true); 
    if (whitelist.indexOf(origin) !== -1)
      return callback(null, true);
    callback(new Error(`Not allowed by CORS. Domain ${origin} not in ${whitelist.join(` `)}`));
  },
  credentials: true,
};

module.exports.initSecurity = app => {
  // Use helmet to secure Express headers

  app.use(helmet());
  app.disable(`x-powered-by`);

  app.use(cors(corsConfig));


  return app;
};

module.exports.initMiddleware = app => {
  // Showing stack errors
  app.set(`showStackError`, true);

  // Enable jsonp
  app.enable(`jsonp callback`);

  // Should be placed before express.static
  app.use(compression({
    level: 2,
  }));

  // Enable logger (morgan) if enabled in the configuration file
  // if (_.has(config, 'log.format')) {
  //   app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()))
  // }

  // Environment dependent middleware
  if (process.env.NODE_ENV === `development`) {
    // Disable views cache
    app.set(`view cache`, false);
  } else if (process.env.NODE_ENV === `production`)
    app.locals.cache = `memory`;


  if (process.env.NODE_ENV === `development`) {
    process.on(`unhandledRejection`, (reason, p) => {
      console.log(`Unhandled Rejection at: Promise`, p, `reason:`, reason);
    });
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.json({
    limit: `50mb`,
    type: `application/json`,
  }));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());

  return app;
};

module.exports.seedDb = async app => {
  
  // clear db first
  const keys = await redisClient.keysAsync('*') 
  await Promise.all(keys.map(k => redisClient.delAsync(k)))

  // dont seed on prod or stage
  if(process.env.SEED_DB != true)
    return app

  let data = SEED_DATA.TESLAS 
      data = data.map(d => redisClient.set(d.id, JSON.stringify(d)))
  await Promise.all(data)
  return app;
};


module.exports.initRoutes = app => {
  
  const routeList = glob.sync(resolve(`./src/routes/**.js`)).map(i => require(resolve(i)));
  routeList.forEach(route => route(app));

  return app;
};
