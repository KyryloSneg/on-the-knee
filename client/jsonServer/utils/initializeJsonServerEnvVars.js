const { env } = require('node:process');

module.exports = function initializeEnvVars() {
  env.OPENCAGE_API_KEY = "48b4518008864120a078fd1a96a834b8";
}