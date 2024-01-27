const { env } = require('node:process');

module.exports = function initializeEnvVars() {
  // TODO: create new account in mapquest
  env.MAPQUERY_API_KEY = "TWj3WwGCGYsUAh9WdWwRUS7RHKbXe3YJ";
}