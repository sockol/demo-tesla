
const _ = require(`lodash`);
const { resolve } = require(`path`);
const chalk = require(`chalk`);

process.env.NODE_ENV = process.env.NODE_ENV || `development`;

require(`dotenv`).config({
  path: `.env.${process.env.NODE_ENV}`,
});

const port = parseInt(process.env.PORT, 10) || 3000;
const server = require(resolve(`./server/index`));

server
  .then(app => app.listen(port, async err => {
    if (err) throw err;

    let s = ``;
    s += chalk.green(`\n✔ success`) + ` mode: ${process.env.NODE_ENV}`;
    s += chalk.green(`\n✔ success`) + ` server started on: http://localhost:${port}`;
    s += chalk.green(`\n✔ success`) + ` api endpoint on: ${process.env.API_URI}`;

    console.log(s);
  }))
  .catch(console.log);
