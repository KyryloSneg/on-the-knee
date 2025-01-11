// See https://github.com/kitloong/json-server-vercel/blob/main/api/server.js
const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
const routes = require("../routes.json");

const server = jsonServer.create();

// allow write operations
const dbDataFilePath = path.join('db.json');
const data = fs.readFileSync(dbDataFilePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db);

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.rewriter(routes));
server.use(router);

server.listen(7000, () => {
    console.log('JSON Server is running');
});

// Export the Server API
module.exports = server;