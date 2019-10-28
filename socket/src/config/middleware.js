
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

module.exports.initRoutes = app => {
  const routeList = glob.sync(resolve(`./src/routes/**.js`)).map(i => require(resolve(i)));
  routeList.forEach(route => route(app));

  return app;
};



module.exports.initSocket = server => {

  const io = require('socket.io')(server)

  const TeslaTracker = require(resolve('./src/sockets'))

  //listen on every connection
  io.on('connection', TeslaTracker.initConnection)

  return server
}