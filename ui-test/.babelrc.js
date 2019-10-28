 
const globEnvConfigs = configs => {
 
  const map = {}
  Object.keys(configs.parsed).forEach(k => map[`process.env.${k}`] = configs.parsed[k])
    
  return map 
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const configs = require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});   
const env = globEnvConfigs(configs)

module.exports = {
  "presets": [
    "next/babel"
  ],
  "plugins": [
    [
      "styled-components",
      {
        "ssr": true, 
        "displayName": true, 
        "preprocess": false 
      }
    ],
    [
      "module-resolver",
      {
        "root": ["./"],
        "alias": {
          "components": "./components",
          "utils": "./utils",
          "config": "./config", 
        }
      }
    ],
    [ "transform-define", env ],
    "import-glob",
  ]
};