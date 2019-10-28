
const config = require(`./staging.js`);
const uuid = require(`uuid/v4`);


const TESLAS = []
for(let i = 0; i < 100; i++){
  TESLAS.push({
    id: uuid(),
    title: `car ${i}`,
    color: 0xffffff,
    latitude: Math.random(),
    longitude: Math.random(),
  })
}

// dont seed on prod ever
module.exports = {
  ...config,
  seed: {
    TESLAS,
  },
}