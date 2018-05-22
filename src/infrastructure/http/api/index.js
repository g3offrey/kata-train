const restify = require("restify");
const registerReservationRoute = require("./reservation/");

const { LISTENING_PORT } = process.env;

function start() {
  const server = restify.createServer();

  server.use(restify.plugins.bodyParser());

  registerReservationRoute(server);

  server.listen(LISTENING_PORT, () => {
    console.log(`Listening on ${LISTENING_PORT} ...`);
  });
}

module.exports = start;
