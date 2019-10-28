
const express = require(`express`);
const next = require(`next`);
const { resolve } = require(`path`);
const cookieParser = require(`cookie-parser`);

const bodyParser = require(`body-parser`);
const helmet = require(`helmet`);
const compression = require(`compression`);

const renderRoutes = require(resolve(`./server/routes`));

const dev = process.env.NODE_ENV === `development`;

module.exports = new Promise(async (resolve, reject) => {
  const dir = `.`;
  const app = next({ dev, dir });

  await app.prepare().catch(reject);

  let server = express();

  if (process.env.NODE_ENV === `development`) {
    process.on(`unhandledRejection`, (reason, p) => {
      console.log(`Unhandled Rejection at: Promise`, p, `reason:`, reason);
    });
  }

  server.use(bodyParser.json({
    limit: `2MB`, // because mongo
  }));
  server.use(bodyParser.urlencoded({
    extended: false,
  }));
  server.enable(`trust proxy`);
  server.use(helmet());
  server.use(cookieParser());

  // because cf doesnt allow gzip for some reason
  server.use(compression());

  server.use((req, res, next) => {
    if (process.env.NODE_ENV === `development`)
      return next();
    if (req.protocol === `https`)
      return next();
    res.redirect(302, `https://${req.headers.host}${req.url}`);
  });

  server = renderRoutes(server, { dev, app });

  return resolve(server);
});

