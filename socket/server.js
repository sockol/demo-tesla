
const dotenv = require(`dotenv`);
const { resolve } = require(`path`);
const chalk = require(`chalk`);

process.env.NODE_ENV = process.env.NODE_ENV || `development`;
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const server = require(resolve(`./src/config/index`));
const { initSocket } = require(resolve(`./src/config/middleware`));

server()
  .then(app => {
    const port = parseInt(process.env.PORT, 10) || 3000;

    const server = app.listen({ port }, async () => {
      let s = ``;
      s += chalk.green(`\n✔ success`) + ` mode: ${process.env.NODE_ENV}`;
      s += chalk.green(`\n✔ success`) + ` server started on: http://localhost:${port}`;

      console.log(s);
    });

    initSocket(server)
  })
  .catch(console.log);
