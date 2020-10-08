const WebSocket = require("ws");
const config = require("./config");
const logger = require("./logger")();
const ws = new WebSocket.Server({ port: config.PORT });
const allowedIps = config.SERVERS;
function JsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (_) {
    return false;
  }
}
function heartbeat() {
  this.isAlive = true;
}
function noop() { }

ws.on("connection", function connection(socket, req) {
  const ip = req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;
  socket.ip = ip.split(/\s*,\s*/)[0].match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost/)[0];
  logger.info("New connection from", socket.ip);
  if (!allowedIps.includes(socket.ip)) {
    logger.warn(socket.ip, " not allowed");
    socket.terminate();
    return;
  }
  socket.isAlive = true;
  socket.on("pong", heartbeat);
  socket.on("close", function closed(code, reason) {
    logger.warn("Connection from", socket.ip, " closed:", code, reason);
  });
  socket.on("message", function message(msg) {
    msg = JsonParse(msg);
    if (!msg || !msg.app) return;
    if (!socket.logger) {
      socket.logger = logger.create(`${msg.app}`);
    }
    if (socket.logger[msg.type]) {
      socket.logger[msg.type](`${msg.data}`);
    } else {
      socket.logger.info(`${msg.data}`);
    }
  });
});

const interval = setInterval(function ping() {
  ws.clients.forEach(function each(socket) {
    if (socket.isAlive === false) return socket.terminate();

    socket.isAlive = false;
    socket.ping(noop);
  });
}, 30000);


ws.on("error", function close(e) {
  clearInterval(interval);
  logger.error(e);
});
ws.on("close", function close(s) {
  clearInterval(interval);
  logger.warn(s);

});
ws.on("listening", function listening() {
  logger.success("Logger server is listening on port", config.PORT);
});