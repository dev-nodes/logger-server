const envalid = require("envalid");
const { port, makeValidator } = envalid;

const arr = makeValidator(x => {
  if (typeof x === "string") return x.split(",");
  else throw new Error("Expected comma separated string");
}, "arr");

module.exports = envalid.cleanEnv(process.env, {
  PORT: port({ default: 8080 }),
  SERVERS: arr({ default: "localhost,127.0.0.1" })
});