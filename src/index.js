const WebSocket = require("ws")
const http = require("http")
const consola = require('consola')
const {authenticate} = require('./auth.js')
const server = http.createServer();
const ws = new WebSocket.Server({ server });
const allowedIps = process.env.SERVERS.split(',')
function JsonParse(str) {
  try{
    return JSON.parse(str)
  }catch(_) {
    return false;
  }
}
ws.on('connection', function connection(socket,req) {
  const ip = req.socket.remoteAddress
  if(!allowedIps.includes(ip)) {
     socket.terminate()
  }
  socket.on('message', function message(msg) {
    msg = JsonParse(msg);
    if(!msg || !msg.app) return;
    if(msg.type === "log") {
      consola.log(`[${msg.app.toUpperCase()}-${ip}][LOG] ${msg.data}`);
    }else if(msg.type === "error") {
      consola.error(`[${msg.app.toUpperCase()}-${ip}][ERROR] ${msg.data}`)
    } else {
      consola.info(`[${msg.app.toUpperCase()}-${ip}][ERROR] ${msg.data}`)
    }
  });
});

exports.start = (port = 8080) => {
  server.listen(process.env.PORT || port, "localhost", () => {
    consola.info('API Listening on port', process.env.PORT || port)
  });
}