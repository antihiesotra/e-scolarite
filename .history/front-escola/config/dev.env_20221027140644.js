var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  /* API_BASE_URL: '"http://api-escola.exemple.com"' */
  API_BASE_URL: '"http://localhost:8080"'
})
