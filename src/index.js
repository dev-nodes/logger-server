const WebSocket = require("ws")
const http = require("http")
const consola = require('consola')
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
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress
  consola.info("New connection from",ip);
  if(!allowedIps.includes(ip)) {
    consola.info(ip," not allowed");
     socket.terminate()
     return;
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