
const removeSlash = s => s[s.length - 1] === `/` ? s.substring(0, s.length - 1) : s;

module.exports = (server, { app, cacheStoreInstance }) => {
  const handle = app.getRequestHandler();

  server.get(``, (req, res) => app.render(req, res, `/home`));

  server.get(`*`, (req, res) => {
    const parsedUrl = removeSlash(req.url);

    handle(req, res, parsedUrl);
  });

  return server;
};
